import { createSlice } from "@reduxjs/toolkit";
import type { IAiConnection } from "types/ai-connection";
import { getAiConnectionsThunk, revokeAiConnectionThunk } from "./thunk";

interface AiConnectionState {
  connections: IAiConnection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  revokingId: string | null;
}

export const initialState: AiConnectionState = {
  connections: [],
  status: "idle",
  error: null,
  revokingId: null,
};

const AiConnectionSlice = createSlice({
  name: "AiConnection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAiConnectionsThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getAiConnectionsThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.connections = action.payload;
    });
    builder.addCase(getAiConnectionsThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = (action.payload as string | undefined) ?? "Đã có lỗi xảy ra";
    });
    builder.addCase(revokeAiConnectionThunk.pending, (state, action) => {
      state.revokingId = action.meta.arg;
    });
    builder.addCase(revokeAiConnectionThunk.fulfilled, (state, action) => {
      state.revokingId = null;
      state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
      );
    });
    builder.addCase(revokeAiConnectionThunk.rejected, (state) => {
      state.revokingId = null;
    });
  },
});

export default AiConnectionSlice.reducer;
