import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addFlex, getAllFlex, deleteFlex, updateFlex } from "../../api/flexApi";

export const fetchFlexes = createAsyncThunk(
  "flex/fetchFlexes",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getAllFlex(page, limit);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createFlex = createAsyncThunk(
  "flex/createFlex",
  async (flexData, { rejectWithValue }) => {
    try {
      const response = await addFlex(flexData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeFlex = createAsyncThunk(
  "flex/removeFlex",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFlex(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateFlexEntry = createAsyncThunk(
  "flex/updateFlex",
  async ({ id, flexData }, { rejectWithValue }) => {
    try {
      const response = await updateFlex(id, flexData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const flexSlice = createSlice({
  name: "flex",
  initialState: {
    flexes: [],
    totalCount:0,
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlexes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFlexes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flexes = action.payload.flexes;
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchFlexes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createFlex.fulfilled, (state, action) => {
        state.flexes.push(action.payload);
      })
      .addCase(removeFlex.fulfilled, (state, action) => {
        state.flexes = state.flexes.filter(
          (flex) => flex._id !== action.payload
        );
      })
      .addCase(updateFlexEntry.fulfilled, (state, action) => {
        const index = state.flexes.findIndex(
          (flex) => flex._id === action.payload._id
        );
        if (index !== -1) {
          state.flexes[index] = action.payload;
        }
      });
  },
});

export default flexSlice.reducer;
