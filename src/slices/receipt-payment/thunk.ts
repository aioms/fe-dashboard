import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReceiptPaymentListStart,
  getReceiptPaymentListSuccess,
  getReceiptPaymentListFailure,
  getReceiptDebtListStart,
  getReceiptDebtListSuccess,
  getReceiptDebtListFailure,
  getReceiptDebtDetailStart,
  getReceiptDebtDetailSuccess,
  getReceiptDebtDetailFailure,
  getReceiptDebtPaymentHistoryStart,
  getReceiptDebtPaymentHistorySuccess,
  getReceiptDebtPaymentHistoryFailure,
  getReceiptCollectionListStart,
  getReceiptCollectionListSuccess,
  getReceiptCollectionListFailure,
  deleteReceiptCollectionStart,
  deleteReceiptCollectionSuccess,
  deleteReceiptCollectionFailure,
  createReceiptPaymentStart,
  createReceiptPaymentSuccess,
  createReceiptPaymentFailure,
  updateReceiptPaymentStart,
  updateReceiptPaymentSuccess,
  updateReceiptPaymentFailure,
  deleteReceiptPaymentStart,
  deleteReceiptPaymentSuccess,
  deleteReceiptPaymentFailure,
} from "./reducer";
import {
  ReceiptPaymentFilterDto,
  ReceiptDebtFilterDto,
  ReceiptCollectionFilterDto,
  CreateReceiptPaymentRequestDto,
  UpdateReceiptPaymentRequestDto,
} from "types/receiptPayment";
import * as receiptPaymentAPI from "apis/receipt/receiptPayment";

// Using real API calls instead of mock data

// Get Receipt Payment List
export const getReceiptPaymentList = createAsyncThunk(
  "receiptPayment/getList",
  async (filters: ReceiptPaymentFilterDto, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getReceiptPaymentListStart());

      const response = await receiptPaymentAPI.getReceiptPayments(filters);

      const data = {
        data: response.data,
        pagination: response.metadata
      };

      dispatch(getReceiptPaymentListSuccess(data));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt payments';
      dispatch(getReceiptPaymentListFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Single Receipt Payment
export const getReceiptPaymentDetail = createAsyncThunk(
  "receiptPayment/getDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await receiptPaymentAPI.getReceiptPayment(id);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt payment detail';
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Receipt Debt List
export const getReceiptDebtList = createAsyncThunk(
  "receiptPayment/getDebtList",
  async (filters: ReceiptDebtFilterDto, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getReceiptDebtListStart());

      const response = await receiptPaymentAPI.getReceiptDebts(filters);

      const data = {
        data: response.data,
        pagination: response.metadata
      };

      dispatch(getReceiptDebtListSuccess(data));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt debts';
      dispatch(getReceiptDebtListFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Single Receipt Debt Detail
export const getReceiptDebtDetail = createAsyncThunk(
  "receiptPayment/getDebtDetail",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getReceiptDebtDetailStart());

      const response = await receiptPaymentAPI.getReceiptDebt(id);

      dispatch(getReceiptDebtDetailSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt debt detail';
      dispatch(getReceiptDebtDetailFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Receipt Debt Payment History
export const getReceiptDebtPaymentHistory = createAsyncThunk(
  "receiptPayment/getDebtPaymentHistory",
  async (receiptDebtId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getReceiptDebtPaymentHistoryStart());

      const response = await receiptPaymentAPI.getReceiptDebtPaymentHistory(receiptDebtId);

      dispatch(getReceiptDebtPaymentHistorySuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt debt payment history';
      dispatch(getReceiptDebtPaymentHistoryFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Create Receipt Payment
export const createReceiptPayment = createAsyncThunk(
  "receiptPayment/create",
  async (paymentData: CreateReceiptPaymentRequestDto, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createReceiptPaymentStart());

      const response = await receiptPaymentAPI.createReceiptPayment(paymentData);

      dispatch(createReceiptPaymentSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while creating receipt payment';
      dispatch(createReceiptPaymentFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Receipt Payment
export const updateReceiptPayment = createAsyncThunk(
  "receiptPayment/update",
  async ({ id, data }: { id: string; data: UpdateReceiptPaymentRequestDto }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateReceiptPaymentStart());

      const response = await receiptPaymentAPI.updateReceiptPayment({ id, ...data });

      dispatch(updateReceiptPaymentSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while updating receipt payment';
      dispatch(updateReceiptPaymentFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Receipt Payment
export const deleteReceiptPayment = createAsyncThunk(
  "receiptPayment/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteReceiptPaymentStart());

      await receiptPaymentAPI.deleteReceiptPayment(id);

      dispatch(deleteReceiptPaymentSuccess(id));
      return id;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while deleting receipt payment';
      dispatch(deleteReceiptPaymentFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Receipt Collection List
export const getReceiptCollectionList = createAsyncThunk(
  "receiptPayment/getCollectionList",
  async (filters: ReceiptCollectionFilterDto, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getReceiptCollectionListStart());

      const response = await receiptPaymentAPI.getReceiptCollections(filters);

      const data = {
        data: response.data,
        pagination: response.metadata
      };

      dispatch(getReceiptCollectionListSuccess(data));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching receipt collections';
      dispatch(getReceiptCollectionListFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Receipt Collection
export const deleteReceiptCollection = createAsyncThunk(
  "receiptPayment/deleteCollection",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteReceiptCollectionStart());

      await receiptPaymentAPI.deleteReceiptCollection(id);

      dispatch(deleteReceiptCollectionSuccess(id));
      return id;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while deleting receipt collection';
      dispatch(deleteReceiptCollectionFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Unpaid Receipts for Supplier Payment
export const getUnpaidReceipts = createAsyncThunk(
  "receiptPayment/getUnpaidReceipts",
  async (supplierId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await receiptPaymentAPI.getUnpaidReceipts(supplierId);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while fetching unpaid receipts';
      return rejectWithValue(errorMessage);
    }
  }
);