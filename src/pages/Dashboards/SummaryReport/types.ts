export enum ReceiptDebtStatus {
  PENDING = "pending",
  PARTIAL_PAID = "partial_paid",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ReceiptImportStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  WAITING = "waiting",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  SHORT_RECEIVED = "short_received",
  OVER_RECEIVED = "over_received",
}

export enum ReceiptReturnStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ReceiptCheckStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  BALANCING_REQUIRED = "balancing_required",
  BALANCED = "balanced",
}

export interface CountSummary {
  count: number;
  totalAmount: number;
}

export interface TransactionDetail {
  id: string;
  code: string;
  type: number; // 1: PAYMENT, 2: REFUND
  amount: number;
  paymentMethod: number;
  status: number; // 1: PENDING, 2: SUCCEEDED, 3: FAILED
  description: string | null;
  processedAt: string;
  createdAt: string | null;
}

export interface PaymentDetail {
  id: string;
  code: string;
  type: number; // 1: ORDER, 2: RECEIPT_DEBT
  status: number; // 0: PAID, 1: PARTIALLY_PAID, 2: CANCELLED
  referenceId: string | null;
  totalAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  transactions: TransactionDetail[];
}

export interface PaymentMethodGroup {
  paymentMethod: number; // Enum: 1: CASH, 2: BANK_TRANSFER, 3: CREDIT_CARD
  totalAmount: number;
  transactionCount: number;
  payments: PaymentDetail[];
}

export interface OrderItemWithCost {
  productId: string;
  productName: string;
  code: string;
  quantity: number;
  price: number;
  costPrice: number; // Cost of Goods Sold from Product table
  vatRate: number;
}

export interface OrderDetail {
  id: string;
  code: string;
  type: string; // "sales", "internal_transfer"
  status: string; // "draft", "pending", "completed", "cancelled"
  totalAmount: number;
  paymentMethod: string;
  note: string | null;
  createdAt: string | null;
  items: OrderItemWithCost[];
}

export interface ReceiptItemDetail {
  productId: string;
  productCode: number;
  productName: string;
  quantity: number;
  costPrice: number; // Item cost at the time of receipt
  productCostPrice: number; // Current live product cost
  discount: number;
  discountType: string | null;
}

export interface ReceiptDebtDetail {
  id: string;
  code: string;
  type: string; // "supplier_debt", "customer_debt"
  status: string; // "pending", "partial_paid", "completed", "cancelled"
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  supplierId: string | null;
  customerId: string | null;
  createdAt: string | null;
  items: ReceiptItemDetail[];
}

export interface RevenueBreakdown {
  revenue: number;
  count: number;
  cost: number;
}

export interface RevenueData {
  totalRevenue: number;
  orderCost: number;
  debtCost: number;
  totalCost: number;
  grossProfit: number;
  breakdown: {
    orders: RevenueBreakdown;
    debts: RevenueBreakdown;
  };
}

export interface DailyTransactionSummaryResponse extends RevenueData {
  date: string; // Format: YYYY-MM-DD
  summary: {
    orders: CountSummary;
    receiptDebts: CountSummary;
    receiptImports: CountSummary;
    receiptReturns: CountSummary;
    receiptChecks: CountSummary;
  };
  paymentsGroupedByMethod: PaymentMethodGroup[];
  orderDetails: OrderDetail[];
  receiptDebtDetails: ReceiptDebtDetail[];
}

export interface TransactionSummaryResponse {
  success: boolean;
  statusCode: number;
  data: DailyTransactionSummaryResponse;
}
