export interface DebtReturnReceipt {
  receiptNumber: string;
  status: "draft" | "processing" | "completed" | "cancelled";
  operationType: "return" | "exchange";
  note?: string;
  refId?: string;
  originalReturnAmount: number;
  replacementAmount: number;
  differenceAmount: number;
  exchangeItems?: Array<
    { productId: string; productName: string; quantity: number; unitPrice: number; vatRate?: number }
  >;
}
