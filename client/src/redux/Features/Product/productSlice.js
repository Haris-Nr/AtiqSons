import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  fetchProductData: [],
  AllProductData: [],
  IntrackingProductdata: [],
  gettrackproduct: [],
  dubaiProductData: [],

  productdata: {},
  SingleProductData: {},
  deleteProductData: {},
  productStatusData: {},
  trackStatusData: {},
  TrackProductData: {},

  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  search: "",

  isLoading: false,
  error: {},
};

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (addproductData, thunkAPI) => {
    try {
      const response = await productApi.addProduct(addproductData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const Productsbyemployee = createAsyncThunk(
  "product/Productsbyemployee",
  async (productDataId, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search } = getState().product;
      const response = await productApi.fetchProductsbyemployee(
        productDataId,
        currentPage,
        pageSize,
        search
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const SingleProduct = createAsyncThunk(
  "/product/fetchSingleProduct",
  async (id, thunkAPI) => {
    try {
      const response = await productApi.getSingleProduct(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const AllProduct = createAsyncThunk(
  "/product/fetchallProduct",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search } = getState().product;
      const response = await productApi.getAllProduct(
        currentPage,
        pageSize,
        search
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProductbyId = createAsyncThunk(
  "product/deleteproductbyid",
  async (id, thunkAPI) => {
    try {
      const response = await productApi.deleteProduct(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const ProductStatus = createAsyncThunk(
  "product/productstatus",
  async ({ id, newStatus }, thunkAPI) => {
    try {
      const response = await productApi.changeProductStatus(id, newStatus);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const TrackingProduct = createAsyncThunk(
  "/product/trackProduct",
  async (data, thunkAPI) => {
    try {
      const response = await productApi.getTrackProduct(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTrackingProduct = createAsyncThunk(
  "/product/getTrackingProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/api/product/gettrackProduct/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const TrackStatus = createAsyncThunk(
  "product/changeTrackStatus",
  async ({ id, newStatus }, thunkAPI) => {
    try {
      const response = await productApi.changeTrackStatus(id, newStatus);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getIntrackingProduct = createAsyncThunk(
  "product/intrackingProduct",
  async (productDataId, { rejectWithValue }) => {
    try {
      const response = await productApi.getIntrackingProduct(productDataId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const DubaiProduct = createAsyncThunk(
  "/product/dubairoduct",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search } = getState().product;
      const response = await productApi.dubaiProduct(    currentPage,
        pageSize,
        search);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.productdata = {};
    },
    resetDeleteState: (state) => {
      state.deleteProductData = {};
    },
    resetProductStatusState: (state) => {
      state.productStatusData = {};
    },
    resetTrackStatusState: (state) => {
      state.trackStatusData = {};
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // add product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productdata = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productdata = action.payload;
      })

      // products by employee
      .addCase(Productsbyemployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Productsbyemployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fetchProductData = action.payload.data;
        state.currentPage = action.payload?.currentPage;
        state.totalPages = action.payload?.totalPages;
        state.totalItems = action.payload?.totalItems;
        state.search = action.payload?.search;
      })
      .addCase(Productsbyemployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // single product
      .addCase(SingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SingleProductData = action.payload;
      })
      .addCase(SingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.SingleProductData = action.payload;
      })

      // all products
      .addCase(AllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AllProductData = action?.payload?.data;
        state.currentPage = action.payload?.page;
        state.pageSize = action.payload?.limit;
        state.totalItems = action.payload?.totalProduct;
        state.totalPages = action.payload?.totalPages;
        state.search = action.payload?.search;
      })
      .addCase(AllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // delete product
      .addCase(deleteProductbyId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductbyId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteProductData = action.payload;
      })
      .addCase(deleteProductbyId.rejected, (state, action) => {
        state.isLoading = false;
        state.deleteProductData = action.payload;
      })
      // status
      .addCase(ProductStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ProductStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productStatusData = action.payload;
      })
      .addCase(ProductStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.productStatusData = action.payload;
      })
      // tracking
      .addCase(TrackingProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TrackingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.TrackProductData = action.payload;
      })
      .addCase(TrackingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.TrackProductData = action.payload;
      })
      // tracking status
      .addCase(TrackStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(TrackStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trackStatusData = action.payload;
      })
      .addCase(TrackStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.trackStatusData = action.payload;
      })
      // intracking Product
      .addCase(getIntrackingProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIntrackingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IntrackingProductdata = action.payload;
      })
      .addCase(getIntrackingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get Tracking Product
      .addCase(getTrackingProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrackingProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gettrackproduct = action.payload;
      })
      .addCase(getTrackingProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.gettrackproduct = action.error;
      })
      // approved Dubai products
      .addCase(DubaiProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DubaiProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dubaiProductData = action.payload;
        state.currentPage = action.payload?.page;
        state.pageSize = action.payload?.limit;
        state.totalItems = action.payload?.totalProduct;
        state.totalPages = action.payload?.totalPages;
        state.search = action.payload?.search;
      })
      .addCase(DubaiProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetProductState,
  resetDeleteState,
  resetProductStatusState,
  resetTrackStatusState,
  setCurrentPage,
  setPageSize,
  setSearch,
} = productSlice.actions;
export default productSlice.reducer;
