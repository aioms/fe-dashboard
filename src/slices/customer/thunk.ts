import { createAsyncThunk } from "@reduxjs/toolkit";
import { createCustomer, updateCustomer, deleteCustomer, getCustomers } from "apis/customer";

export const getCustomersThunk = createAsyncThunk(
  "customers/getCustomers",
  getCustomers,
);

export const addCustomerThunk = createAsyncThunk(
  "customers/addCustomer",
  createCustomer
);

export const updateCustomerThunk = createAsyncThunk(
  "customers/updateCustomer",
  updateCustomer,
);

export const deleteCustomerThunk = createAsyncThunk(
  "customers/deleteCustomer",
  deleteCustomer,
);