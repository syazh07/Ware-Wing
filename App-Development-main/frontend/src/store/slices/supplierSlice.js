import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supplierService from "../../services/supplierService";

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  searchQuery: "",
};

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await supplierService.getAll();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const createSupplier = createAsyncThunk(
  "suppliers/create",
  async (dto, { rejectWithValue }) => {
    try {
      return await supplierService.create(dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      return await supplierService.update(id, dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await supplierService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     

      .addCase(updateSupplier.fulfilled, (state) => {
  state.loading = false;
})

      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const {
  setSearchQuery,
  setSelectedItem,
} = supplierSlice.actions;

export default supplierSlice.reducer;