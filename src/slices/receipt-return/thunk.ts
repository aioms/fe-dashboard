import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { IHttpResponse } from "types";
import { request } from "helpers/axios";
import { convertObjToQueryString } from "helpers/utils";

const TYPE_PREFIX = "ReceiptReturn";

export const getReceiptReturnList = createAsyncThunk(
  `${TYPE_PREFIX}/getReceiptReturnList`,
  async (event?: any) => {
    try {
      const query = convertObjToQueryString(event);
      const response: IHttpResponse = await request.get(
        `/receipt-return?${query}`
      );

      if (
        (response.statusCode && response.statusCode !== 200) ||
        !response.success
      ) {
        toast.error(response.message);
        return null;
      }

      return {
        data: response.data,
        metadata: response.metadata,
      };
    } catch (error: any) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  }
);

export const getReceiptReturnInfo = createAsyncThunk(
  `${TYPE_PREFIX}/getReceiptReturnInfo`,
  async (event?: any) => {
    try {
      const response: IHttpResponse = await request.get(
        `/receipt-return/${event}`
      );

      if (
        (response.statusCode && response.statusCode !== 200) ||
        !response.success
      ) {
        toast.error(response.message);
        return null;
      }

      const { receipt, items } = response.data;

      return {
        receipt,
        items,
      };
    } catch (error: any) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  }
);

export const deleteReceiptReturn = createAsyncThunk(
  `${TYPE_PREFIX}/deleteReceiptReturn`,
  async (event: any) => {
    try {
      const response: IHttpResponse = await request.delete(
        `/receipt-return/${event}`
      );

      if (typeof response === "string") {
        toast.warn(response);
        return null;
      }

      if (
        (response.statusCode && response.statusCode !== 204) ||
        !response.success
      ) {
        toast.error(response.message);
        return null;
      }

      toast.success("Xóa phiếu thành công", { autoClose: 2000 });
      return event;
    } catch (error: any) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  }
);

export const getReceiptReturnByReceiptNumber = createAsyncThunk(
  `${TYPE_PREFIX}/getReceiptReturnByReceiptNumber`,
  async (event?: any) => {
    try {
      const response: IHttpResponse = await request.get(
        `/receipt-return/receipt-items/${event}`
      );

      if (
        (response.statusCode && response.statusCode !== 200) ||
        !response.success
      ) {
        toast.error(response.message);
        return null;
      }

      const { receipt, items } = response.data;

      return {
        receipt,
        items,
      };
    } catch (error: any) {
      toast.error(error.message, { autoClose: 2000 });
      return null;
    }
  }
);
export const updateDebtReturn = createAsyncThunk(
  `${TYPE_PREFIX}/updateDebtReturn`,
  async ({ id, status, note }: { id: string; status: import("types/debt-return").DebtReturnReceipt["status"]; note: string }) => {
    const { updateDebtReturnReceipt } = await import("apis/receipt-return");
    return updateDebtReturnReceipt(id, status, note);
  }
);
