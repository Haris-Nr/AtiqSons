import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImage, allImage, deleteImage } from '../../api/fianceApi'; 


// Async thunk for uploading an image
export const uploadImageAsync = createAsyncThunk(
    'images/upload',
    async (img, { rejectWithValue }) => {
      try {
        const response = await uploadImage(img);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  
  // Async thunk for fetching all images
  export const fetchAllImagesAsync = createAsyncThunk(
    'images/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await allImage();
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );
  
  // Async thunk for deleting an image
  export const deleteImageAsync = createAsyncThunk(
    'images/delete',
    async (id, { rejectWithValue }) => {
      try {
        const response = await deleteImage(id);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response.data);
      }
    }
  );

  export const fianceSlice = createSlice({
    name: 'fiance',
    initialState: {
      images: [],
      isLoading: false,
      message:null,
      error: null,
    },
    reducers: {
      // Define reducers if necessary
    },
    extraReducers: (builder) => {
      builder
        // Handle upload image
        .addCase(uploadImageAsync.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(uploadImageAsync.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(uploadImageAsync.rejected, (state, action) => {
          console.log(action.payload)
          state.isLoading = false;
          state.error = action.payload;
        })
        // Handle fetch all images
        .addCase(fetchAllImagesAsync.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchAllImagesAsync.fulfilled, (state, action) => {
          state.isLoading = false;
          state.images = action.payload.images;
        })
        .addCase(fetchAllImagesAsync.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        // Handle delete image
        .addCase(deleteImageAsync.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteImageAsync.fulfilled, (state, action) => {
          state.isLoading = false;
          state.images = state.images.filter(image => image.id !== action.payload.id);
        })
        .addCase(deleteImageAsync.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    },
  });
  
  // Export the reducer
  export default fianceSlice.reducer;