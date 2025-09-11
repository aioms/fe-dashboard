import { createSlice } from "@reduxjs/toolkit";
import {
  addOrderThunk,
  updateOrderThunk,
  getOrdersThunk,
  getOrderThunk,
} from "./thunk";

export const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {},
  message: {},
};

export const OrderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {
    resetMessage: (state: any) => {
      state.message = {};
    },
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(getOrdersThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.orders = action.payload?.data;
      state.pagination = action.payload?.metadata;
    });
    builder.addCase(getOrdersThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // Get single order
    builder.addCase(getOrderThunk.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.currentOrder = action.payload;
      }
    });
    builder.addCase(getOrderThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // Add
    builder.addCase(addOrderThunk.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.orders.unshift(action.payload);
        state.message = {
          type: "success",
          text: "Thêm đơn hàng thành công",
        };
      }
    });
    builder.addCase(addOrderThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // Update
    builder.addCase(
      updateOrderThunk.fulfilled,
      (state: any, action: any) => {
        if (!action.payload) return;

        state.orders = state.orders.map((order: any) =>
          order.id === action.payload.id
            ? { ...order, ...action.payload }
            : order
        );
        state.message = {
          type: "success",
          text: "Cập nhật đơn hàng thành công",
        };
      }
    );
    builder.addCase(updateOrderThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
  },
});

export const { resetMessage } = OrderSlice.actions;

export default OrderSlice.reducer;