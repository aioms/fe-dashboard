import { createSlice } from "@reduxjs/toolkit";
import {
  getProductList,
  addProductList,
  updateProductList,
  deleteProductList,
  getCategories,
  getUnits,
} from "./thunk";

export const initialState = {
  productList: [],
  pagination: {},
  categoryList: [],
  unitList: [],
  message: {},
};

const ProductSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    resetMessage: (state: any) => {
      state.message = {};
    }
  },
  extraReducers: (builder) => {
    // get list
    builder.addCase(getProductList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.productList = action.payload?.data;
      state.pagination = action.payload?.metadata;
    });
    builder.addCase(getProductList.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // add
    builder.addCase(addProductList.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.productList.unshift(action.payload);
        state.message = {
          type: "success",
          text: "Thêm mới thành công",
        };
      }
    });
    builder.addCase(addProductList.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // update
    builder.addCase(updateProductList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.productList = state.productList.map((product: any) =>
        product.id === action.payload.id
          ? { ...product, ...action.payload }
          : product
      );
      state.message = {
        type: 'success',
        text: 'Cập nhật thành công',
      }
    });
    builder.addCase(updateProductList.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // delete
    builder.addCase(deleteProductList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.productList = state.productList.filter(
        (product: any) => product.id.toString() !== action.payload.toString()
      );
      state.message = {
        type: 'success',
        text: 'Xóa thành công',
      }
    });
    builder.addCase(deleteProductList.rejected, (state: any, action: any) => {
      state.message = {
        type: "error",
        text: action.error || { message: "Something Error" },
      };
    });
    // get category
    builder.addCase(getCategories.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.categoryList = action.payload?.data;
    });
    // get units
    builder.addCase(getUnits.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.unitList = action.payload?.data;
    });
  },
});

export const { resetMessage } = ProductSlice.actions;
export default ProductSlice.reducer;
