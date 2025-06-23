import { createSlice } from "@reduxjs/toolkit";
import {
  addSupplierThunk,
  deleteSupplierThunk,
  updateSupplierThunk,
  getSuppliersThunk,
} from "./thunk";

export const initialState = {
  suppliers: [],
  pagination: {},
  message: {},
};

const SupplierSlice = createSlice({
  name: "Supplier",
  initialState,
  reducers: {
    resetMessage: (state: any) => {
      state.message = {};
    }
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(getSuppliersThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.suppliers = action.payload?.data;
      state.pagination = action.payload?.metadata;
    });
    builder.addCase(getSuppliersThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
    // Add
    builder.addCase(addSupplierThunk.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.suppliers.unshift(action.payload);
        state.message = {
          type: 'success',
          text: 'Thêm mới thành công',
        };
      }
    });
    builder.addCase(addSupplierThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
    // Update
    builder.addCase(updateSupplierThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.suppliers = state.suppliers.map((supplier: any) =>
        supplier.id === action.payload.id ? { ...supplier, ...action.payload } : supplier,
      );
      state.message = {
        type: 'success',
        text: 'Cập nhật thành công',
      }
    });
    builder.addCase(updateSupplierThunk.rejected, (state: any, action: any) => {
      state.message = {
        error: action.error || { message: "Something Error" },
      }
    });
    // Delete
    builder.addCase(deleteSupplierThunk.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.suppliers = state.suppliers.filter(
        (supplier: any) => supplier.id.toString() !== action.payload.toString(),
      );
      state.message = {
        type: 'success',
        text: 'Xóa thành công',
      }
    });
    builder.addCase(deleteSupplierThunk.rejected, (state: any, action: any) => {
      state.message = {
        type: 'error',
        text: action.error || { message: "Something Error" },
      }
    });
  },
});

export const { resetMessage } = SupplierSlice.actions;
export default SupplierSlice.reducer;
