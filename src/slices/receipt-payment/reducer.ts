import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  ReceiptPayment, 
  ReceiptPaymentListResponse,
  ReceiptDebt,
  ReceiptDebtListResponse,
  ReceiptCollection,
  ReceiptCollectionListResponse,
  ReceiptDebtPaymentHistory
} from "types/receiptPayment";

export interface ReceiptPaymentState {
  data: ReceiptPayment[];
  debtData: ReceiptDebt[];
  collectionData: ReceiptCollection[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  debtPagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  collectionPagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  loading: boolean;
  debtLoading: boolean;
  collectionLoading: boolean;
  paymentHistoryLoading: boolean;
  error: string | null;
  selectedPayment: ReceiptPayment | null;
  selectedDebt: ReceiptDebt | null;
  paymentHistory: ReceiptDebtPaymentHistory | null;
}

const initialState: ReceiptPaymentState = {
  data: [],
  debtData: [],
  collectionData: [],
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
  debtPagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
  collectionPagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  debtLoading: false,
  collectionLoading: false,
  paymentHistoryLoading: false,
  error: null,
  selectedPayment: null,
  selectedDebt: null,
  paymentHistory: null,
};

const receiptPaymentSlice = createSlice({
  name: "receiptPayment",
  initialState,
  reducers: {
    // Receipt Payment Actions
    getReceiptPaymentListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getReceiptPaymentListSuccess: (state, action: PayloadAction<ReceiptPaymentListResponse>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    getReceiptPaymentListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Receipt Debt Actions
    getReceiptDebtListStart: (state) => {
      state.debtLoading = true;
      state.error = null;
    },
    getReceiptDebtListSuccess: (state, action: PayloadAction<ReceiptDebtListResponse>) => {
      state.debtLoading = false;
      state.debtData = action.payload.data;
      state.debtPagination = action.payload.pagination;
      state.error = null;
    },
    getReceiptDebtListFailure: (state, action: PayloadAction<string>) => {
      state.debtLoading = false;
      state.error = action.payload;
    },

    // Get Receipt Debt Detail
    getReceiptDebtDetailStart: (state) => {
      state.debtLoading = true;
      state.error = null;
    },
    getReceiptDebtDetailSuccess: (state, action: PayloadAction<ReceiptDebt>) => {
      state.debtLoading = false;
      state.selectedDebt = action.payload;
      state.error = null;
    },
    getReceiptDebtDetailFailure: (state, action: PayloadAction<string>) => {
      state.debtLoading = false;
      state.error = action.payload;
    },

    // Get Receipt Debt Payment History
    getReceiptDebtPaymentHistoryStart: (state) => {
      state.paymentHistoryLoading = true;
      state.error = null;
    },
    getReceiptDebtPaymentHistorySuccess: (state, action: PayloadAction<ReceiptDebtPaymentHistory>) => {
      state.paymentHistoryLoading = false;
      state.paymentHistory = action.payload;
      state.error = null;
    },
    getReceiptDebtPaymentHistoryFailure: (state, action: PayloadAction<string>) => {
      state.paymentHistoryLoading = false;
      state.error = action.payload;
    },

    // Receipt Collection Actions
    getReceiptCollectionListStart: (state) => {
      state.collectionLoading = true;
      state.error = null;
    },
    getReceiptCollectionListSuccess: (state, action: PayloadAction<ReceiptCollectionListResponse>) => {
      state.collectionLoading = false;
      state.collectionData = action.payload.data;
      state.collectionPagination = action.payload.pagination;
      state.error = null;
    },
    getReceiptCollectionListFailure: (state, action: PayloadAction<string>) => {
      state.collectionLoading = false;
      state.error = action.payload;
    },

    // Delete Receipt Collection
    deleteReceiptCollectionStart: (state) => {
      state.collectionLoading = true;
      state.error = null;
    },
    deleteReceiptCollectionSuccess: (state, action: PayloadAction<string>) => {
      state.collectionLoading = false;
      state.collectionData = state.collectionData.filter(item => item.id !== action.payload);
      state.error = null;
    },
    deleteReceiptCollectionFailure: (state, action: PayloadAction<string>) => {
      state.collectionLoading = false;
      state.error = action.payload;
    },

    // Create Receipt Payment
    createReceiptPaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createReceiptPaymentSuccess: (state, action: PayloadAction<ReceiptPayment>) => {
      state.loading = false;
      state.data.unshift(action.payload);
      state.error = null;
    },
    createReceiptPaymentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Receipt Payment
    updateReceiptPaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateReceiptPaymentSuccess: (state, action: PayloadAction<ReceiptPayment>) => {
      state.loading = false;
      const index = state.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
      state.error = null;
    },
    updateReceiptPaymentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Receipt Payment
    deleteReceiptPaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteReceiptPaymentSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data = state.data.filter(item => item.id !== action.payload);
      state.error = null;
    },
    deleteReceiptPaymentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set Selected Payment
    setSelectedPayment: (state, action: PayloadAction<ReceiptPayment | null>) => {
      state.selectedPayment = action.payload;
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  setSelectedPayment,
  clearError,
} = receiptPaymentSlice.actions;

export default receiptPaymentSlice.reducer;