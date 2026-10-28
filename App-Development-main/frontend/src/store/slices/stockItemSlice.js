// src/store/slices/stockItemSlice.js

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import stockItemService from "../../services/stockItemService";

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  searchQuery: "",
};

// ==========================================
// FETCH ALL STOCK ITEMS
// ==========================================

export const fetchStockItems =
  createAsyncThunk(
    "stockItems/fetchAll",

    async (_, { rejectWithValue }) => {

      try {

        const data =
          await stockItemService.getAll();

        console.log(
          "Fetched stock items:",
          data
        );

        return Array.isArray(data)
          ? data
          : [];

      } catch (error) {

        console.error(
          "Fetch stock items failed:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch stock items"
        );
      }
    }
  );

// ==========================================
// CREATE STOCK ITEM
// ==========================================

export const createStockItem =
  createAsyncThunk(
    "stockItems/create",

    async (
      dto,
      { rejectWithValue }
    ) => {

      try {

        console.log(
          "Creating stock item:",
          dto
        );

        const response =
          await stockItemService.create(
            dto
          );

        console.log(
          "Create stock item response:",
          response
        );

        return response;

      } catch (error) {

        console.error(
          "Create stock item failed:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create stock item"
        );
      }
    }
  );

// ==========================================
// UPDATE STOCK ITEM
// ==========================================

export const updateStockItem =
  createAsyncThunk(
    "stockItems/update",

    async (
      { id, dto },
      { rejectWithValue }
    ) => {

      try {

        const response =
          await stockItemService.update(
            id,
            dto
          );

        return response;

      } catch (error) {

        console.error(
          "Update stock item failed:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update stock item"
        );
      }
    }
  );

// ==========================================
// DELETE STOCK ITEM
// ==========================================

export const deleteStockItem =
  createAsyncThunk(
    "stockItems/delete",

    async (
      id,
      { rejectWithValue }
    ) => {

      try {

        await stockItemService.delete(
          id
        );

        return id;

      } catch (error) {

        console.error(
          "Delete stock item failed:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete stock item"
        );
      }
    }
  );

// ==========================================
// SLICE
// ==========================================

const stockItemSlice =
  createSlice({

    name: "stockItems",

    initialState,

    reducers: {

      setSearchQuery: (
        state,
        action
      ) => {

        state.searchQuery =
          action.payload;
      },

      setSelectedItem: (
        state,
        action
      ) => {

        state.selectedItem =
          action.payload;
      },
    },

    extraReducers: (builder) => {

      // ======================================
      // FETCH
      // ======================================

      builder

        .addCase(
          fetchStockItems.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchStockItems.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;
            state.error = null;

            state.items =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            console.log(
              "Redux stock items updated:",
              state.items
            );
          }
        )

        .addCase(
          fetchStockItems.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch stock items";
          }
        );

      // ======================================
      // CREATE
      // ======================================

      builder

        .addCase(
          createStockItem.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createStockItem.fulfilled,
          (state) => {

            /*
             * Backend returns a STRING:
             *
             * "StockItem created successfully."
             *
             * It does not return the object.
             *
             * StockItemForm therefore calls:
             *
             * dispatch(fetchStockItems())
             *
             * after this succeeds.
             */

            state.loading = false;
            state.error = null;
          }
        )

        .addCase(
          createStockItem.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to create stock item";
          }
        );

      // ======================================
      // UPDATE
      // ======================================

      builder

        .addCase(
          updateStockItem.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateStockItem.fulfilled,
          (state) => {

            /*
             * Backend returns a success
             * message rather than the updated
             * StockItem.
             *
             * StockItemForm refreshes the list.
             */

            state.loading = false;
            state.error = null;
          }
        )

        .addCase(
          updateStockItem.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to update stock item";
          }
        );

      // ======================================
      // DELETE
      // ======================================

      builder

        .addCase(
          deleteStockItem.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          deleteStockItem.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;
            state.error = null;

            state.items =
              state.items.filter(
                (item) =>
                  item.id !==
                  action.payload
              );
          }
        )

        .addCase(
          deleteStockItem.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to delete stock item";
          }
        );
    },
  });

// ==========================================
// ACTIONS
// ==========================================

export const {
  setSearchQuery,
  setSelectedItem,
} =
  stockItemSlice.actions;

// ==========================================
// REDUCER
// ==========================================

export default stockItemSlice.reducer;