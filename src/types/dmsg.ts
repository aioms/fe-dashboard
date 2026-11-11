export interface DmsgFinancials {
  invoiceTotal: number; totalCost: number; vatRate: number; commissionRate: number;
  invoiceFee: number; beforeVat: number; vatAmount: number; revenue: number;
  customerTransfer: number; profit: number;
}
export interface DmsgOrderDetail {
  attachments?: Array<{ fileId: string; kind: "cost_image" | "invoice_pdf" }>;
  id: string; code: string; status: string; note: string; dmsg: DmsgFinancials;
  customer?: { name: string } | null;
  items: Array<{ productId: string; productName: string; quantity: number }>;
  dmsgSettlements?: { netReceived: number; customerTransferred: number; feesPaid: number };
}
