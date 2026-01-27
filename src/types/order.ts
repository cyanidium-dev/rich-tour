export interface Order {
  id: string;

  index: number;            // П/П
  orderNumber: string;      // Номер замовлення
  tourTitle: string;        // Назва туру
  daysQuantity: number;     // Кількість днів
  tourists: string;         // Дані туристів

  totalCost: number;        // Вартість заявки
  commission: number;       // Комісія
  paidAmount: number;       // Внесено коштів
  remainingAmount: number; // Залишок до сплати

  startDate: string;        // Дата початку
  endDate: string;          // Дата завершення
  status: "active" | "completed" | "cancelled";
  comment: string;
}

export type OrderStatus =
    | "не почався"
    | "в процесы"
    | "завершений"
    | "відмінений";

export interface OrderTableRow {
  id: string;

  index: number;                 // П/П
  orderNumber: string;           // Номер замовлення
  tourTitle: string;             // Назва туру
  daysQuantity: number;          // Кількість днів

  tourists: string;              // Дані туристів

  totalCost: number;             // Вартість заявки
  commission: number;            // Комісія
  paidAmount: number;            // Внесено коштів
  remainingAmount: number;       // Залишок до сплати

  startDate: string;             // Дата початку (ISO або dd.mm.yyyy)
  endDate: string;               // Дата завершення
  status: OrderStatus;           // Статус заявки

  comment: string;               // Коментар
}

