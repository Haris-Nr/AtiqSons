import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productApi from "../../api/productApi";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  selectItemProducts: [],
  fetchProductData: [],
  AllProductData: [],
  IntrackingProductdata: [],
  gettrackproduct: [],
  dubaiProductData: [],
  alltrackingProduct:{},
  data: [],

  productdata: {},
  
  SingleProductData: {},
  deleteProductData: {},
  productStatusData: {},
  trackStatusData: {},
  TrackProductData: {},
  updateProduct:{},

  currentPage: 1,
  pageSize: 10,
  search: "",
  priceLow:null,
  priceHigh:null,
  
  isLoading: false,
  error: {},
};

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (addproductData, thunkAPI) => {
    try {
      return await productApi.addProduct(addproductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const Productsbyemployee = createAsyncThunk(
  "product/Productsbyemployee",
  async ({ company }, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search,priceLow,priceHigh } = getState().product;
      return await productApi.fetchProductsbyemployee(
        company,
        currentPage,
        pageSize,
        search,
        priceLow,
        priceHigh
      );
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductsBySelectItem = createAsyncThunk(
  "product/fetchProductsBySelectItem",
  async (selectItem, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search,priceLow,priceHigh } = getState().product;
      const response = await productApi.fetchProductsBySelectItem(
        selectItem,
        currentPage,
        pageSize,
        search,
        priceLow,
        priceHigh
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
  async (company, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search,priceLow,priceHigh } = getState().product;
      return await productApi.getAllProduct(
        currentPage,
        pageSize,
        search,
        company,
        priceLow,
        priceHigh,
      );
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
    console.log(data);
    try {
      const response = await productApi.AddTrackProduct(data);
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

export const AllTrackingProduct = createAsyncThunk("product/allTrackingProduct", async ({ page, limit }, thunkAPI) => {
  try {
    const response = await productApi.allTrackingProduct(page, limit);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
})

export const DubaiProduct = createAsyncThunk(
  "/product/dubairoduct",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentPage, pageSize, search } = getState().product;
      const response = await productApi.dubaiProduct(
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

export const updateProductById = createAsyncThunk(
  "product/updateProductById",
  async ({ id, updatedProductData }, thunkAPI) => {
    try {
      return await productApi.updateProduct(id, updatedProductData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteTrack = createAsyncThunk(
  "product/deleteTrack",
  async (trackId, thunkAPI)=>{
    try {
        const response = await productApi.deleteTrack(trackId)
        return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productApi.searchProducts(query);
      return response;
    } catch (error) {
      // Use `rejectWithValue` to return a custom error payload
      return rejectWithValue(error.response?.data || { message: "Could not complete the search." });
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
    setPriceLow: (state, action) => {
      state.priceLow = action.payload
    },
    setPriceHigh: (state, action) => {
      state.priceHigh = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productdata = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productdata = action.payload;
      })

      // products by employee
      .addCase(Productsbyemployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Productsbyemployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productdata = action.payload;
      })
      .addCase(Productsbyemployee.rejected, (state, action) => {
        state.isLoading = false;
        state.productdata = action.payload;
      })
      // products by select item
      .addCase(fetchProductsBySelectItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsBySelectItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectItemProducts = action.payload.data;
        state.currentPage = action.payload?.currentPage;
        state.totalPages = action.payload?.totalPages;
        state.totalItems = action.payload?.totalItems;
        state.search = action.payload?.search;
      })
      .addCase(fetchProductsBySelectItem.rejected, (state, action) => {
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
        state.productdata = action.payload;
      })
      .addCase(AllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productdata = action.payload;
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
        console.log(action.payload)
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
        state.error = action.payload;
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
      })
      
      // update product
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.productdata = action.payload;
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.productdata = action.payload;
      })

      .addCase(AllTrackingProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AllTrackingProduct.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.alltrackingProduct = action.payload;
      })
      .addCase(AllTrackingProduct.rejected,(state)=>{
        state.isLoading = false;
      })
      .addCase(deleteTrack.pending,(state)=>{
        state.isLoading = true;
      })
      .addCase(deleteTrack.fulfilled,(state)=>{
        state.isLoading = false;
      })
      .addCase(deleteTrack.rejected,(state,action)=> {
        state.isLoading=false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
            
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
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
  setPriceHigh,
  setPriceLow,
} = productSlice.actions;
export default productSlice.reducer;
