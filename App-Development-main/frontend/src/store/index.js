import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import stockItemReducer from "./slices/stockItemSlice";
import purchaseOrderReducer from "./slices/purchaseOrderSlice";
import supplierReducer from "./slices/supplierSlice";
import stockMovementReducer from "./slices/stockMovementSlice";
import reorderRuleReducer from "./slices/reorderRuleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    stockItems: stockItemReducer,
    purchaseOrders: purchaseOrderReducer,
    suppliers: supplierReducer,
    stockMovements: stockMovementReducer,
    reorderRules: reorderRuleReducer,
  },
});

export default store;