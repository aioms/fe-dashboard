# Request DTO (create, update, filters list)
export interface CreateReceiptPaymentRequestDto {
  paymentDate: string;
  expenseType: ReceiptPaymentExpenseType;
  expenseTypeName?: string; // For "OTHER" type to store custom name
  paymentObject?: string; // Name of the payment object
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  attachments?: Attachment[];
  status?: ReceiptPaymentStatus;
  supplierId?: string;
  receiptImportId?: string; // Reference to receipt import if this is a supplier payment
}

export interface UpdateReceiptPaymentRequestDto {
  paymentDate?: string;
  expenseType?: ReceiptPaymentExpenseType;
  expenseTypeName?: string;
  paymentObject?: string;
  amount?: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  attachments?: Attachment[];
  status?: ReceiptPaymentStatus;
  supplierId?: string;
  receiptImportId?: string;
}

export interface ReceiptPaymentFilterDto {
  keyword?: string;
  expenseType?: ReceiptPaymentExpenseType;
  status?: ReceiptPaymentStatus;
  supplierId?: string;
  paymentDate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

# Receipt Payment (enum, types)
export enum ReceiptPaymentExpenseType {
  SUPPLIER_PAYMENT = "supplier_payment",
  TRANSPORTATION = "transportation",
  UTILITIES = "utilities",
  RENT = "rent",
  LABOR = "labor",
  OTHER = "other",
}

export enum ReceiptPaymentStatus {
  DRAFT = "draft",
  PAID = "paid",
  DEBT_PAYMENT = "debt_payment",
  CANCELLED = "cancelled"
}

export interface Attachment {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const receiptPaymentTable = pgTable(DbTables.ReceiptPayments, {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique().notNull(),
  paymentDate: timestamp("payment_date", { mode: "string" }).notNull(),
  expenseType: text("expense_type").$type<ReceiptPaymentExpenseType>().notNull(),
  expenseTypeName: text("expense_type_name"), // For "OTHER" type to store custom name
  paymentObject: text("payment_object"), // Name of the payment object
  amount: customNumeric("amount").notNull(),
  paymentMethod: smallint("payment_method").$type<PaymentMethod>().notNull(),
  notes: text("notes"),
  attachments: jsonb("attachments").$type<Attachment[]>().default([]),
  status: text("status").notNull().default(ReceiptPaymentStatus.DRAFT),

  // References
  supplierId: uuid("supplier_id").references(() => supplierTable.id, {
    onDelete: "set null",
  }),
  receiptImportId: uuid("receipt_import_id"), // Reference to receipt import if this is a supplier payment
  userId: uuid("user_id").notNull().references(() => userTable.id),

  ...timestampsWithoutDeletedAt,
});