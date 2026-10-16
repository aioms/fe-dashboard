import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAiConnections, revokeAiConnection } from "apis/aiConnection";

const FETCH_ERROR = "Không thể tải danh sách kết nối AI";
const REVOKE_ERROR = "Không thể thu hồi kết nối";

export const getAiConnectionsThunk = createAsyncThunk(
  "aiConnections/getAiConnections",
  async (_: void, { rejectWithValue }) => {
    try {
      return await getAiConnections();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error && error.message ? error.message : FETCH_ERROR
      );
    }
  }
);

export const revokeAiConnectionThunk = createAsyncThunk(
  "aiConnections/revokeAiConnection",
  async (id: string, { rejectWithValue }) => {
    try {
      const revokedId = await revokeAiConnection(id);
      toast.success("Đã thu hồi kết nối", { autoClose: 2000 });
      return revokedId;
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : REVOKE_ERROR;
      toast.error(message, { autoClose: 2000 });
      return rejectWithValue(message);
    }
  }
);
