import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseOrderService from "../../services/purchaseOrderService";

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  filterByStatus: "",
};

export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await purchaseOrderService.getAll();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrders/create",
  async (dto, { rejectWithValue }) => {
    try {
      return await purchaseOrderService.create(dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "purchaseOrders/updateStatus",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      let response;

      if (action === "submit") {
        response = await purchaseOrderService.submit(id);
      } else if (action === "approve") {
        response = await purchaseOrderService.approve(id);
      } else if (action === "receive") {
        response = await purchaseOrderService.receive(id);
      } else {
        throw new Error("Invalid purchase order action");
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await purchaseOrderService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: "purchaseOrders",
  initialState,

  reducers: {
    setFilterStatus: (state, action) => {
      state.filterByStatus = action.payload;
    },

    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateOrderStatus.fulfilled, (state) => {
  // The updated purchase order is fetched again
  // after the status change.
})

      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const {
  setFilterStatus,
  setSelectedItem,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;