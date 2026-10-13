param([ValidateSet('apply', 'rollback')][string]$Action)

$ErrorActionPreference = 'Stop'
$documentId = 'a4605a13-67ad-4c44-91f7-fbf568d6a8d1'
$backupPath = Join-Path $PSScriptRoot 'data/temporary-costa-brava-2026-09-13-hotel-backup.json'
$envPath = Join-Path (Split-Path $PSScriptRoot) '.env.local'
$settings = @{}
Get-Content -LiteralPath $envPath | ForEach-Object {
  if ($_ -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
    $settings[$Matches[1]] = $Matches[2].Trim('"').Trim("'")
  }
}
$token = $settings['SANITY_API_TOKEN']
if (-not $token) { throw 'SANITY_API_TOKEN is missing' }
$projectId = if ($settings['SANITY_PROJECT_ID']) { $settings['SANITY_PROJECT_ID'] } else { 'elggedkx' }
$dataset = if ($settings['SANITY_DATASET']) { $settings['SANITY_DATASET'] } else { 'production' }
$version = if ($settings['SANITY_API_VERSION']) { $settings['SANITY_API_VERSION'] } else { '2025-04-26' }
$baseUrl = "https://$projectId.api.sanity.io/v$version/data"
$headers = @{ Authorization = "Bearer $token" }

function Get-Tour {
  $query = '*[_id == "' + $documentId + '"][0]{_id,_rev,_type,title,dateRange,hotels,"slug":basic->slug.current}'
  $uri = "$baseUrl/query/$dataset`?perspective=raw&query=$([uri]::EscapeDataString($query))"
  return (Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -TimeoutSec 30).result
}

function Set-Hotels($revision, $hotels) {
  $body = @{
    mutations = @(@{
      patch = @{
        id = $documentId
        ifRevisionID = $revision
        set = @{ hotels = @($hotels) }
      }
    })
  } | ConvertTo-Json -Depth 100 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($body)
  Invoke-RestMethod -Uri "$baseUrl/mutate/$dataset" -Headers $headers -Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes -TimeoutSec 30 | Out-Null
}

function New-Key { return [guid]::NewGuid().ToString('N').Substring(0, 12) }

if ($Action -eq 'apply') {
  if (Test-Path -LiteralPath $backupPath) { throw "Backup already exists: $backupPath" }
  $tour = Get-Tour
  if ($tour._type -ne 'tour-to-date' -or
      $tour.dateRange.startDate -ne '2026-09-13' -or
      $tour.slug -ne 'kosta-brava-morskii-tur-ispaniya' -or
      @($tour.hotels).Count -ne 1 -or
      @($tour.hotels[0].gallery).Count -lt 2) {
    throw 'Tour or hotel data differs from the expected 13 September departure'
  }

  $duplicate = $tour.hotels[0] | ConvertTo-Json -Depth 100 | ConvertFrom-Json
  $duplicate._key = New-Key
  $duplicate.title = "$($tour.hotels[0].title) — тестовий варіант"
  foreach ($image in $duplicate.gallery) { $image._key = New-Key }
  $duplicate.gallery = @($duplicate.gallery[1..($duplicate.gallery.Count - 1)]) + @($duplicate.gallery[0])
  foreach ($block in @($duplicate.shortDescription) + @($duplicate.fullDescription)) {
    $block._key = New-Key
    foreach ($child in $block.children) { $child._key = New-Key }
  }
  $shortSpan = $duplicate.shortDescription | ForEach-Object { $_.children } | Where-Object { $_.text -like '*всього приблизно за 400*' } | Select-Object -First 1
  $fullSpan = $duplicate.fullDescription | ForEach-Object { $_.children } | Where-Object { $_.text -like '*приблизно за 400*' } | Select-Object -First 1
  if (-not $shortSpan -or -not $fullSpan) { throw 'Hotel description differs from the expected text' }
  $shortSpan.text = $shortSpan.text.Replace('всього приблизно за 400', 'орієнтовно за 400')
  $fullSpan.text = $fullSpan.text.Replace('приблизно за 400', 'орієнтовно за 400')

  $backup = @{
    documentId = $documentId
    date = $tour.dateRange.startDate
    slug = $tour.slug
    originalRevision = $tour._rev
    originalHotels = @($tour.hotels)
    addedHotelKey = $duplicate._key
    addedHotelTitle = $duplicate.title
    createdAt = [DateTime]::UtcNow.ToString('o')
  } | ConvertTo-Json -Depth 100
  [IO.File]::WriteAllText($backupPath, "$backup`n", (New-Object Text.UTF8Encoding($false)))
  Set-Hotels $tour._rev @($tour.hotels[0], $duplicate)
  $updated = Get-Tour
  if (@($updated.hotels).Count -ne 2 -or $updated.hotels[1]._key -ne $duplicate._key) {
    throw 'Mutation returned but the second hotel could not be verified'
  }
  Write-Output "Added $($duplicate.title) to $($updated.title); backup: $backupPath"
}
elseif ($Action -eq 'rollback') {
  $backup = Get-Content -LiteralPath $backupPath -Raw | ConvertFrom-Json
  if ($backup.documentId -ne $documentId) { throw 'Backup document ID does not match' }
  $tour = Get-Tour
  if (-not @($tour.hotels | Where-Object { $_._key -eq $backup.addedHotelKey }).Count) {
    Write-Output 'Temporary hotel is already absent; nothing to roll back'
    return
  }
  Set-Hotels $tour._rev @($tour.hotels | Where-Object { $_._key -ne $backup.addedHotelKey })
  $updated = Get-Tour
  if (@($updated.hotels | Where-Object { $_._key -eq $backup.addedHotelKey }).Count) {
    throw 'Temporary hotel is still present after rollback'
  }
  Write-Output "Removed temporary hotel from $($updated.title)"
}
