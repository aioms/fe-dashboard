import { createSlice } from "@reduxjs/toolkit";
import {
  addCustomerThunk,
  deleteCustomerThunk,
  updateCustomerThunk,
  getCustomersThunk,
} from "./thunk";

export const initialState = {
  customers: [],
  pagination: {},
  message: {},
};

const CustomerSlice = createSlice({
  name: "Customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List
    builder.addCase(getCustomersThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.customers = action.payload?.data;
      state.pagination = action.payload?.metadata;
    });
    builder.addCase(getCustomersThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
    // Add
    builder.addCase(addCustomerThunk.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.customers.unshift(action.payload);
        state.message = {
          type: 'success',
          text: 'Thêm mới thành công',
        };
      }
    });
    builder.addCase(addCustomerThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
    // Update
    builder.addCase(updateCustomerThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.customers = state.customers.map((customer: any) =>
        customer.id === action.payload.id ? { ...customer, ...action.payload } : customer,
      );
      state.message = {
        type: 'success',
        text: 'Cập nhật thành công',
      }
    });
    builder.addCase(updateCustomerThunk.rejected, (state: any, action: any) => {
      state.message = {
        error: action.error || { message: "Something Error" },
      }
    });
    // Delete
    builder.addCase(deleteCustomerThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.customers = state.customers.filter(
        (customer: any) => customer.id.toString() !== action.payload.toString(),
      );
      state.message = {
        type: 'success',
        text: 'Xóa thành công',
      }
    });
    builder.addCase(deleteCustomerThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
  },
});

export default CustomerSlice.reducer;