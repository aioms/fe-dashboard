import { createSlice } from "@reduxjs/toolkit";
import {
  getUserList,
  addUserList,
  updateUserList,
  deleteUserList,
} from "./thunk";

export const initialState = {
  userList: [],
  pagination: {},
  error: {},
};

const UsersSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    resetMessage: (state: any) => {
      state.error = {};
    }
  },
  extraReducers: (builder) => {
    // List
    builder.addCase(getUserList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;
      state.userList = action.payload?.data;
      state.pagination = action.payload?.metadata;
    });
    builder.addCase(getUserList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
    // Add
    builder.addCase(addUserList.fulfilled, (state: any, action: any) => {
      if (action.payload) {
        state.userList.unshift(action.payload);
      }
    });
    builder.addCase(addUserList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
    // Update
    builder.addCase(updateUserList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.userList = state.userList.map((user: any) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user,
      );
    });
    builder.addCase(updateUserList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
    // Delete
    builder.addCase(deleteUserList.fulfilled, (state: any, action: any) => {
      if (!action.payload) return;

      state.userList = state.userList.filter(
        (user: any) => user.id.toString() !== action.payload.toString(),
      );
    });
    builder.addCase(deleteUserList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
  },
});

export const { resetMessage } = UsersSlice.actions;

export default UsersSlice.reducer;
