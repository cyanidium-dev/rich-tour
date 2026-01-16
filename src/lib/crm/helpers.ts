export function yesNo(value: boolean): 'Так' | 'Ні' {
    return value ? 'Так' : 'Ні'
}

export function toCrmDate(date: string) {
    // ожидаем DD.MM.YYYY
    const [day, month, year] = date.split('.')

    if (!day || !month || !year) {
        throw new Error(`Invalid date format: ${date}`)
    }

    return `${year}-${month}-${day}`
}
