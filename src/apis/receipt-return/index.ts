import { request } from "helpers/axios";
import type { IHttpResponse } from "types";
import type { DebtReturnReceipt } from "types/debt-return";

export async function updateDebtReturnReceipt(id: string, status: DebtReturnReceipt["status"], note: string) {
  const response: IHttpResponse = await request.put(`/receipt-return/${id}`, { status, note });
  if (!response.success) throw new Error(response.message || "Unable to update return receipt");
  return response.data;
}
