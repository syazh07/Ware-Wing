import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reorderRuleService from "../../services/reorderRuleService";

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  evaluationResult: null,
};

export const fetchReorderRules = createAsyncThunk(
  "reorderRules/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await reorderRuleService.getAll();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const createReorderRule = createAsyncThunk(
  "reorderRules/create",
  async (dto, { rejectWithValue }) => {
    try {
      return await reorderRuleService.create(dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const updateReorderRule = createAsyncThunk(
  "reorderRules/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      return await reorderRuleService.update(id, dto);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const deleteReorderRule = createAsyncThunk(
  "reorderRules/delete",
  async (id, { rejectWithValue }) => {
    try {
      await reorderRuleService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

export const evaluateRules = createAsyncThunk(
  "reorderRules/evaluate",
  async (_, { rejectWithValue }) => {
    try {
      return await reorderRuleService.evaluate();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);

const reorderRuleSlice = createSlice({
  name: "reorderRules",
  initialState,

  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReorderRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReorderRules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchReorderRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createReorderRule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateReorderRule.fulfilled, (state, action) => {
        const updatedRule = action.payload;

        const index = state.items.findIndex(
          (item) => item.id === updatedRule.id
        );

        if (index !== -1) {
          state.items[index] = updatedRule;
        }
      })

      .addCase(deleteReorderRule.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(evaluateRules.fulfilled, (state, action) => {
        state.evaluationResult = action.payload;
      });
  },
});

export const { setSelectedItem } = reorderRuleSlice.actions;

export default reorderRuleSlice.reducer;