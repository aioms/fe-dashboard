// Receipt Payment Types and Interfaces
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

export enum PaymentMethod {
  CASH = 1,
  BANK_TRANSFER = 2,
  CREDIT_CARD = 3,
  CHECK = 4,
  E_WALLET = 5
}

export interface Attachment {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  code?: string;
  phone?: string;
  email?: string;
}

export interface ReceiptPayment {
  id: string;
  code: string;
  paymentDate: string;
  expenseType: ReceiptPaymentExpenseType;
  expenseTypeName?: string;
  paymentObject?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  attachments: Attachment[];
  status: ReceiptPaymentStatus;
  supplier?: Supplier;
  supplierId?: string;
  receiptImportId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptPaymentRequestDto {
  paymentDate: string;
  expenseType: ReceiptPaymentExpenseType;
  expenseTypeName?: string;
  paymentObject?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  attachments?: Attachment[];
  status?: ReceiptPaymentStatus;
  supplierId?: string;
  receiptImportId?: string;
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

export interface ReceiptPaymentListResponse {
  data: ReceiptPayment[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// Receipt Debt (Phiếu Thu / Công Nợ) types
export enum ReceiptDebtStatus {
  DEBT = "debt", // Công nợ
  PENDING = "pending", // Chờ thanh toán
  PARTIAL_PAID = "partial_paid", // Đã thu/chi 1 phần
  COMPLETED = "completed", // Hoàn thành
  OVERDUE = "overdue" // Trễ hạn
}

export enum ReceiptDebtType {
  CUSTOMER_DEBT = "customer_debt", // Nợ khách hàng
  SUPPLIER_DEBT = "supplier_debt" // Nợ nhà cung cấp
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface ReceiptDebt {
  id: string;
  code: string;
  expectedCollectionDate?: string; // Thời gian thu dự kiến
  dueDate?: string; // Hạn thanh toán
  customer?: Customer; // For customer debts
  customerName?: string | null; // Alternative format
  supplierName?: string | null; // For supplier debts
  status: ReceiptDebtStatus;
  type?: ReceiptDebtType; // Debt type
  totalDebt?: number; // Công nợ tổng (legacy)
  totalAmount: number; // Total amount
  paidAmount: number; // Đã thanh toán
  remainingAmount: number; // Còn lại
  paymentDate?: string | null; // Actual payment date
  notes?: string;
  note?: string; // Alternative field name
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

export interface ReceiptDebtFilterDto {
  keyword?: string; // Mã phiếu hoặc tên khách hàng/nhà cung cấp
  customerId?: string; // Filter theo khách hàng
  supplierId?: string; // Filter theo nhà cung cấp
  status?: ReceiptDebtStatus; // Filter theo trạng thái
  type?: ReceiptDebtType; // Filter theo loại nợ
  startDate?: string; // Từ ngày thu dự kiến
  endDate?: string; // Đến ngày thu dự kiến
  startDueDate?: string; // From due date (alias)
  endDueDate?: string; // To due date (alias)
  page?: number;
  limit?: number;
}

export interface ReceiptDebtListResponse {
  data: ReceiptDebt[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// Receipt Debt Payment History types
export enum PaymentStatus {
  PENDING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4
}

export enum PaymentType {
  RECEIPT_DEBT = 1,
  RECEIPT_COLLECTION = 2,
  OTHER = 3
}

export enum TransactionStatus {
  PENDING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4
}

export interface DebtPayment {
  id: string;
  code: string;
  amount: number;
  status: PaymentStatus;
  type: PaymentType;
  referenceId: string;
  customerId: string;
  totalAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  meta: any | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaymentTransaction {
  id: string;
  code: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  description: string;
  processedAt: string;
  createdAt: string;
}

export interface ReceiptDebtPaymentHistory {
  payment: DebtPayment;
  transactions: PaymentTransaction[];
}

export interface ReceiptDebtPaymentHistoryResponse {
  data: ReceiptDebtPaymentHistory;
  success: boolean;
  statusCode: number;
}

// Unpaid Receipt Import types (for supplier payment selection)
export enum ReceiptImportStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum ReceiptImportPaymentStatus {
  UNPAID = "unpaid",
  PARTIAL_PAID = "partial_paid",
  PAID = "paid"
}

export interface UnpaidReceiptImport {
  id: string;
  receiptNumber: string;
  note: string;
  totalAmount: number;
  supplier: Supplier;
  warehouse: string;
  paymentDate: string;
  importDate: string;
  status: ReceiptImportStatus;
  paymentStatus: ReceiptImportPaymentStatus;
  createdAt: string;
}

export interface UnpaidReceiptImportListResponse {
  data: UnpaidReceiptImport[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  success: boolean;
  statusCode: number;
}