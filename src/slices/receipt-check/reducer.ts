import { createSlice } from "@reduxjs/toolkit";
import {
  getReceiptCheckList,
  deleteReceiptCheck,
  getReceiptCheckInfo,
  getReceiptCheckByReceiptNumber,
} from "./thunk";

interface State {
  data: any[];
  pagination: any;
  receiptInfo: any;
  receiptItems: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialState: State = {
  data: [],
  pagination: {},
  receiptInfo: {},
  receiptItems: [],
  status: "idle",
  error: null,
};

const ReceiptSlice = createSlice({
  name: "ReceiptCheck",
  initialState,
  reducers: {
    resetMessage: (state: any) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // get list
    builder
      .addCase(getReceiptCheckList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReceiptCheckList.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (!action.payload) return;

        state.data = action.payload?.data;
        state.pagination = action.payload?.metadata;
      })
      .addCase(getReceiptCheckList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });

    // get info
    builder
      .addCase(getReceiptCheckInfo.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (!action.payload) return;
        state.receiptInfo = action.payload?.receipt;
        state.receiptItems = action.payload?.items;
      })
      .addCase(getReceiptCheckInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });

    // get info by receipt number
    builder
      .addCase(
        getReceiptCheckByReceiptNumber.fulfilled,
        (state: any, action: any) => {
        state.status = "succeeded";
          if (!action.payload) return;
          state.receiptInfo = action.payload?.receipt;
          state.receiptItems = action.payload?.items;
        }
      )
      .addCase(getReceiptCheckByReceiptNumber.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });

    // delete
    builder
      .addCase(deleteReceiptCheck.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (!action.payload) return;

        state.data = state.data.filter(
          (item: any) => item.id.toString() !== action.payload.toString()
        );
      })
      .addCase(deleteReceiptCheck.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { resetMessage } = ReceiptSlice.actions;
export default ReceiptSlice.reducer;
