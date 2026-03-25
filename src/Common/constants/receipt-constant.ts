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

export const RECEIPT_DEBT_STATUS = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
  CANCELLED: "cancelled",
};

export const RECEIPT_DEBT_STATUS_OPTIONS = [
  { label: "Chưa thanh toán", value: RECEIPT_DEBT_STATUS.UNPAID },
  { label: "Thanh toán một phần", value: RECEIPT_DEBT_STATUS.PARTIAL },
  { label: "Đã thanh toán", value: RECEIPT_DEBT_STATUS.PAID },
  { label: "Đã hủy", value: RECEIPT_DEBT_STATUS.CANCELLED },
];
