import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { convertObjToQueryString, cleanObject } from "helpers/utils";
import { IHttpResponse } from "types";
import {
  CreateReceiptPaymentRequestDto,
  UpdateReceiptPaymentRequestDto,
  ReceiptPaymentFilterDto,
  ReceiptDebtFilterDto,
  UnpaidReceiptImportListResponse
} from "types/receiptPayment";

// Get Receipt Payments List
export const getReceiptPayments = async (
  payload: ReceiptPaymentFilterDto
) => {
  const cleanedPayload = cleanObject(payload);
  const query = convertObjToQueryString(cleanedPayload);

  const response: IHttpResponse = await request.get(`/receipt-payments${query ? `?${query}` : ''}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return {
    data: response.data,
    metadata: response.metadata,
  };
};

// Get Receipt Debts List (Phiếu Thu / Công Nợ)
export const getReceiptDebtList = async (
  payload: ReceiptDebtFilterDto
) => {
  const cleanedPayload = cleanObject(payload);
  const query = convertObjToQueryString(cleanedPayload);

  const response: IHttpResponse = await request.get(`/receipt-debt${query ? `?${query}` : ''}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return {
    data: response.data,
    metadata: response.metadata,
  };
};

// Get Single Receipt Debt
export const getReceiptDebt = async (id: string) => {
  const response: IHttpResponse = await request.get(`/receipt-debt/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

// Get Single Receipt Payment
export const getReceiptPayment = async (id: string) => {
  const response: IHttpResponse = await request.get(`/receipt-payments/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

// Create Receipt Payment
export const createReceiptPayment = async (payload: CreateReceiptPaymentRequestDto) => {
  const cleanedPayload = cleanObject(payload);
  const response: IHttpResponse = await request.post(`/receipt-payments`, cleanedPayload);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.CREATED
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

// Update Receipt Payment
export const updateReceiptPayment = async (payload: UpdateReceiptPaymentRequestDto & { id: string }) => {
  const { id, ...body } = payload;
  const cleanedBody = cleanObject(body);
  const response: IHttpResponse = await request.put(`/receipt-payments/${id}`, cleanedBody);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

// Delete Receipt Payment
export const deleteReceiptPayment = async (id: string) => {
  const response: IHttpResponse = await request.delete(`/receipt-payments/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.NO_CONTENT
  );

  if (isHasError) {
    throw new Error(message);
  }

  return id;
};

// Delete Receipt Debt
export const deleteReceiptDebt = async (id: string) => {
  const response: IHttpResponse = await request.delete(`/receipt-debts/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.NO_CONTENT
  );

  if (isHasError) {
    throw new Error(message);
  }

  return id;
};

// Get Unpaid Receipts for Supplier Payment
export const getUnpaidReceipts = async (supplierId?: string): Promise<UnpaidReceiptImportListResponse> => {
  const params = cleanObject({ supplierId });
  const query = convertObjToQueryString(params);

  const response: IHttpResponse = await request.get(`/receipt-imports/unpaid${query ? `?${query}` : ''}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return {
    data: response.data,
    metadata: response.metadata,
    success: response.success,
    statusCode: response.statusCode
  };
};

// Get Receipt Debt Payment History
export const getReceiptDebtPaymentHistory = async (receiptDebtId: string) => {
  const response: IHttpResponse = await request.get(`/receipt-debt/${receiptDebtId}/payment`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};