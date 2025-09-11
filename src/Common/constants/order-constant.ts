export enum OrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
}

export enum ORDER_TYPE {
  SALE = 1,
  RETURN = 2,
  EXCHANGE = 3,
}

export const ORDER_STATUS_LABELS = {
  [OrderStatus.DRAFT]: "Nháp",
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.COMPLETED]: "Hoàn thành",
};

export const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.CASH]: "Tiền mặt",
  [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PaymentMethod.CREDIT_CARD]: "Thẻ tín dụng",
};

export const ORDER_TYPE_LABELS = {
  [ORDER_TYPE.SALE]: "Bán hàng",
  [ORDER_TYPE.RETURN]: "Trả hàng",
  [ORDER_TYPE.EXCHANGE]: "Đổi hàng",
};

// Validation functions
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return Object.values(OrderStatus).includes(status as OrderStatus);
};

export const isValidPaymentMethod = (
  method: string
): method is PaymentMethod => {
  return Object.values(PaymentMethod).includes(method as PaymentMethod);
};
