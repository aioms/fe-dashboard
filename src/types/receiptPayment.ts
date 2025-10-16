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

// Receipt Collection (Phiếu Thu) types
export enum ReceiptCollectionStatus {
  DEBT = "debt", // Công nợ
  PARTIAL_PAID = "partial_paid", // Đã thu 1 phần
  COMPLETED = "completed", // Hoàn thành
  OVERDUE = "overdue" // Trễ hạn
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface ReceiptCollection {
  id: string;
  code: string;
  expectedCollectionDate: string; // Thời gian thu dự kiến
  customer: Customer;
  status: ReceiptCollectionStatus;
  totalDebt: number; // Công nợ tổng
  paidAmount: number; // Đã thanh toán
  remainingAmount: number; // Còn lại
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ReceiptCollectionFilterDto {
  keyword?: string; // Mã phiếu hoặc tên khách hàng
  customerId?: string; // Filter theo khách hàng
  status?: ReceiptCollectionStatus; // Filter theo trạng thái
  startDate?: string; // Từ ngày thu dự kiến
  endDate?: string; // Đến ngày thu dự kiến
  page?: number;
  limit?: number;
}

export interface ReceiptCollectionListResponse {
  data: ReceiptCollection[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// Receipt Debt specific types based on actual API response
export enum ReceiptDebtStatus {
  PENDING = "pending",
  PARTIAL_PAID = "partial_paid", 
  COMPLETED = "completed",
  OVERDUE = "overdue"
}

export enum ReceiptDebtType {
  CUSTOMER_DEBT = "customer_debt",
  SUPPLIER_DEBT = "supplier_debt"
}

export interface ReceiptDebt {
  id: string;
  code: string;
  createdAt: string;
  customerName: string | null;
  supplierName: string | null;
  dueDate: string;
  note: string;
  paidAmount: number;
  paymentDate: string | null;
  remainingAmount: number;
  status: ReceiptDebtStatus;
  totalAmount: number;
  type: ReceiptDebtType;
}

export interface ReceiptDebtFilterDto {
  keyword?: string; // Search by code or customer/supplier name
  status?: ReceiptDebtStatus; // Filter by status
  type?: ReceiptDebtType; // Filter by debt type
  customerId?: string; // Filter by customer
  supplierId?: string; // Filter by supplier
  startDate?: string; // From due date
  endDate?: string; // To due date
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