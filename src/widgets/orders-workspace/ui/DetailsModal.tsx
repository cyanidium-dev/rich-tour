import { useId, type Dispatch, type SetStateAction } from "react";
import type { OrderTableRow } from "@/entities/order";
import { CloseModalIcon } from "@/shared/ui";

type DetailsItem = NonNullable<OrderTableRow["details"]>[number];

interface ModalProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  className?: string;
  comment?: string;
  confirmationUrl?: string | null;
  details?: DetailsItem[];
  mealType?: string | null;
  totalCost?: number | null;
  commission?: number | null;
  costWithoutCommission?: number | null;
}

const moneyFormatter = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 });

function formatMoney(amount: number | null | undefined): string {
  return amount != null && Number.isFinite(amount) ? `${moneyFormatter.format(amount)} €` : "—";
}

function formatRoomType(amount: number | null | undefined): string {
  return amount != null && Number.isFinite(amount) && amount !== 0
    ? `Superior · ${formatMoney(amount)}`
    : "Standard";
}

function formatService(selected: string | null | undefined, amount: number | null | undefined) {
  if (!selected && amount == null) return "—";
  return `${selected || "—"} · ${formatMoney(amount)}`;
}

const touristHeaders = [
  "П/П",
  "ПІБ",
  "Дата народження",
  "Номер телефону",
  "Серія і номер паспорту",
  "Дійсний до",
  "Виїзд з",
];
const costHeaders = [
  "Турист",
  "Тариф",
  "Номер / котедж",
  "Проживання",
  "Харчування",
  "Тип номеру",
  "Страховка",
  "Передні місця",
  "Туристичний збір",
  "Загальна сума",
  "Комісія",
  "Без комісії",
];

function TableHeader({ headers }: { headers: string[] }) {
  return (
    <thead>
      <tr className="bg-main text-white uppercase text-[12px]">
        {headers.map((header) => (
          <th
            key={header}
            scope="col"
            className="px-3 py-[18px] text-left font-normal first:rounded-l-[8px] last:rounded-r-[8px]"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function DetailsModal({
  isPopUpShown,
  setIsPopUpShown,
  className = "",
  comment,
  confirmationUrl,
  details = [],
  mealType,
  totalCost,
  commission,
  costWithoutCommission,
}: ModalProps) {
  const titleId = useId();
  const touristsId = useId();
  const costId = useId();
  const totals = [
    { label: "Повна вартість заявки", amount: totalCost },
    { label: "Комісія агента", amount: commission },
    { label: "Вартість без комісії агента", amount: costWithoutCommission },
  ];

  return (
    <div
      role="dialog"
      aria-modal={isPopUpShown || undefined}
      aria-hidden={!isPopUpShown}
      aria-labelledby={titleId}
      inert={!isPopUpShown}
      className={`${
        isPopUpShown
          ? "-translate-y-1/2 opacity-100 scale-100"
          : "pointer-events-none -translate-y-1/2 opacity-0 scale-90"
      } fixed left-1/2 top-1/2 -translate-x-1/2 z-[60] flex flex-col w-[92%] max-w-[1100px] max-h-[calc(100dvh-32px)] sm:max-h-[calc(100dvh-80px)] border border-main bg-white rounded-[16px] p-4 sm:p-[25px] xl:p-[40px] transition duration-[600ms] ease-out ${className}`}
    >
      <div className="flex shrink-0 justify-between items-start gap-4">
        <h3 id={titleId} className="text-24semi xl:text-32semi text-[#18181B]">
          Інформація про заявку
        </h3>
        <button
          type="button"
          aria-label="Закрити інформацію про заявку"
          onClick={() => setIsPopUpShown(false)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-main"
        >
          <CloseModalIcon className="size-[18px]" />
        </button>
      </div>
      {confirmationUrl && (
        <a
          href={confirmationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 shrink-0 self-start items-center gap-2 rounded-md py-2 text-14med text-main underline decoration-main/40 underline-offset-4 transition-colors hover:decoration-main focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0"
          >
            <path d="M12 3v12m-5-5 5 5 5-5" />
            <path d="M5 15v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
          </svg>
          <span>Завантажити підтвердження заявки</span>
        </a>
      )}
      <div className="min-h-0 overflow-y-auto overscroll-contain pt-6 pr-1 scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full scrollbar-thumb-main scrollbar-track-transparent popup-scroll">
        {comment && (
          <div className="mb-7">
            <p className="text-16med xl:text-20med text-[#18181B]">Коментар</p>
            <p className="mt-2 whitespace-pre-wrap break-words">{comment}</p>
          </div>
        )}

        <h4 id={touristsId} className="text-16med xl:text-20med mb-4">
          Інформація про туристів
        </h4>
        <div
          role="region"
          aria-labelledby={touristsId}
          tabIndex={0}
          className="w-full overflow-x-auto scrollbar scrollbar-h-[3px] scrollbar-thumb-main"
        >
          <table aria-labelledby={touristsId} className="w-full min-w-[850px] border-collapse">
            <TableHeader headers={touristHeaders} />
            <tbody>
              {details.map((item) => (
                <tr key={item.index} className="border-b border-gray-200 text-14semi">
                  {[
                    item.index,
                    item.pib,
                    item.birthday,
                    item.phone,
                    item.passport,
                    item.passportFinish,
                    item.city,
                  ].map((value, index) => (
                    <td key={index} className="px-3 py-5">
                      {value || "—"}
                    </td>
                  ))}
                </tr>
              ))}
              {!details.length && (
                <tr>
                  <td colSpan={touristHeaders.length} className="px-3 py-5">
                    Інформація про туристів відсутня
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h4 id={costId} className="text-16med xl:text-20med mt-8 mb-4">
          Деталізація вартості
        </h4>
        <p className="text-14reg mb-4">Тип харчування: {mealType || "—"}</p>
        <div
          role="region"
          aria-labelledby={costId}
          tabIndex={0}
          className="w-full overflow-x-auto scrollbar scrollbar-h-[3px] scrollbar-thumb-main"
        >
          <table aria-labelledby={costId} className="w-full min-w-[1500px] border-collapse">
            <TableHeader headers={costHeaders} />
            <tbody>
              {details.map((item) => (
                <tr key={item.index} className="border-b border-gray-200 text-14semi">
                  <th scope="row" className="px-3 py-5 text-left min-w-[180px] font-semibold">
                    {item.pib || "—"}
                  </th>
                  {[
                    formatMoney(item.cost?.tariff),
                    item.cost?.room || "—",
                    formatMoney(item.cost?.accommodation),
                    formatMoney(item.cost?.meals),
                    formatRoomType(item.cost?.airConditioning),
                    formatService(item.cost?.insurance, item.cost?.insuranceAmount),
                    formatService(item.cost?.frontSeats, item.cost?.frontSeatsAmount),
                    formatMoney(item.cost?.touristTax),
                    formatMoney(item.cost?.total),
                    formatMoney(item.cost?.commission),
                    formatMoney(item.cost?.withoutCommission),
                  ].map((value, index) => (
                    <td key={index} className="px-3 py-5 whitespace-nowrap">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              {!details.length && (
                <tr>
                  <td colSpan={costHeaders.length} className="px-3 py-5">
                    Деталізація вартості відсутня
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <dl className="mt-6 grid gap-4 rounded-[12px] bg-gray-50 p-4 text-14semi sm:grid-cols-3">
          {totals.map(({ label, amount }) => (
            <div key={label}>
              <dt className="font-normal">{label}</dt>
              <dd className="mt-2 text-16med">{formatMoney(amount)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
