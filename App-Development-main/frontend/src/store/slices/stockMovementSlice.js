import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockMovementService from "../../services/stockMovementService";

const initialState = {
  items: [],
  loading: false,
  error: null,
  filterByType: "",
};

export const fetchStockMovements = createAsyncThunk(
  "stockMovements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await stockMovementService.getAllMovements();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const createStockMovement = createAsyncThunk(
  "stockMovements/create",
  async (dto, { rejectWithValue }) => {
    try {
      return await stockMovementService.create(dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const stockMovementSlice = createSlice({
  name: "stockMovements",
  initialState,

  reducers: {
    setFilterType: (state, action) => {
      state.filterByType = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStockMovement.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { setFilterType } = stockMovementSlice.actions;

export default stockMovementSlice.reducer;