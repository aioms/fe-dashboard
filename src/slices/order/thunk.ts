import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  updateOrder,
  getOrders,
  getOrder,
} from "apis/order";

export const getOrdersThunk = createAsyncThunk("orders/getOrders", getOrders);

export const getOrderThunk = createAsyncThunk("orders/getOrder", getOrder);

export const addOrderThunk = createAsyncThunk("orders/addOrder", createOrder);

export const updateOrderThunk = createAsyncThunk(
  "orders/updateOrder",
  updateOrder
);