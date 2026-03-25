export const RECEIPT_IMPORT_STATUS = {
  DRAFT: "draft",
  PROCESSING: "processing",
  WAITING: "waiting",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  SHORT_RECEIVED: "short_received",
  OVER_RECEIVED: "over_received",
};

export const RECEIPT_IMPORT_STATUS_OPTIONS = [
  { label: "Nháp", value: RECEIPT_IMPORT_STATUS.DRAFT },
  { label: "Đang xử lý", value: RECEIPT_IMPORT_STATUS.PROCESSING },
  { label: "Đang chờ", value: RECEIPT_IMPORT_STATUS.WAITING },
  { label: "Hoàn thành", value: RECEIPT_IMPORT_STATUS.COMPLETED },
  { label: "Đã hủy", value: RECEIPT_IMPORT_STATUS.CANCELLED },
  { label: "Nhận thiếu", value: RECEIPT_IMPORT_STATUS.SHORT_RECEIVED },
  { label: "Nhận thừa", value: RECEIPT_IMPORT_STATUS.OVER_RECEIVED },
];

export const RECEIPT_RETURN_STATUS = {
  DRAFT: "draft",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const RECEIPT_RETURN_STATUS_OPTIONS = [
  { label: "Nháp", value: RECEIPT_RETURN_STATUS.DRAFT },
  { label: "Đang xử lý", value: RECEIPT_RETURN_STATUS.PROCESSING },
  { label: "Hoàn thành", value: RECEIPT_RETURN_STATUS.COMPLETED },
  { label: "Đã hủy", value: RECEIPT_RETURN_STATUS.CANCELLED },
];

export const RECEIPT_CHECK_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  BALANCING_REQUIRED: "balancing_required",
  BALANCELLED: "balanced",
};

export const RECEIPT_CHECK_STATUS_OPTIONS = [
  { label: "Chờ xử lý", value: RECEIPT_CHECK_STATUS.PENDING },
  { label: "Đang xử lý", value: RECEIPT_CHECK_STATUS.PROCESSING },
  { label: "Cần cân bằng", value: RECEIPT_CHECK_STATUS.BALANCING_REQUIRED },
  { label: "Đã cân bằng", value: RECEIPT_CHECK_STATUS.BALANCELLED },
];

export enum ReceiptDebtStatus {
  PENDING = "pending",
  PARTIAL_PAID = "partial_paid",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PAID = 0,
  PARTIALLY_PAID = 1,
  CANCELLED = 2,
}

export enum PaymentType {
  ORDER = 1,
  RECEIPT_DEBT = 2,
}

export const RECEIPT_DEBT_STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Chờ xử lý", value: ReceiptDebtStatus.PENDING },
  { label: "Thanh toán một phần", value: ReceiptDebtStatus.PARTIAL_PAID },
  { label: "Hoàn thành", value: ReceiptDebtStatus.COMPLETED },
  { label: "Đã hủy", value: ReceiptDebtStatus.CANCELLED },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đã thanh toán", value: PaymentStatus.PAID.toString() },
  { label: "Thanh toán một phần", value: PaymentStatus.PARTIALLY_PAID.toString() },
  { label: "Đã hủy", value: PaymentStatus.CANCELLED.toString() },
];

export const PAYMENT_TYPE_OPTIONS = [
  { label: "Tất cả loại", value: "all" },
  { label: "Đơn hàng", value: PaymentType.ORDER.toString() },
  { label: "Công nợ", value: PaymentType.RECEIPT_DEBT.toString() },
];
