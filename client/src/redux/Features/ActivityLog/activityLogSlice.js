import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import activityLogApi from "../../api/activityLogApi";

const initialState = {
  activityLogs: [],
  aggregatedLogs: [],
  loading: false,
  error: null,
};

export const createActivityLog = createAsyncThunk(
  "activityLog/createActivityLog",
  async ({ data, onSuccess, onFail }, { rejectWithValue }) => {
    try {
      const response = await activityLogApi.createActivityLog(
        data,
        onSuccess,
        onFail
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllActivityLogs = createAsyncThunk(
  "activityLog/getAllActivityLogs",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await activityLogApi.getAllActivityLogs(
        page,
        limit,
        search
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAggregatedLogs = createAsyncThunk(
  "activityLog/getAggregatedLogs",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await activityLogApi.getAggregatedLogs(
        page,
        limit,
        search
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteActivityLog = createAsyncThunk(
  "activityLog/deleteActivityLog",
  async ({ id, onSuccess, onFail }, { rejectWithValue }) => {
    try {
      const response = await activityLogApi.deleteActivityLog(
        id,
        onSuccess,
        onFail
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createActivityLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createActivityLog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload;
      })
      .addCase(getAllActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAggregatedLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAggregatedLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.aggregatedLogs = action.payload;
      })
      .addCase(getAggregatedLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteActivityLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteActivityLog.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activityLogSlice.reducer;
