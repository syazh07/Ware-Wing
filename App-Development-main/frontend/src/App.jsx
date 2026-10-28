import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";

import store from "./store";

import ErrorHandler from "./components/ErrorHandler";
import Navbar from "./components/layout/Navbar";

import Login from "./components/Login";
import Register from "./components/Register";

import StockItemList from "./components/stockItem/StockItemList";
import StockMovementList from "./components/stockMovement/StockMovementList";
import SupplierList from "./components/supplier/SupplierList";
import PurchaseOrderList from "./components/purchaseOrder/PurchaseOrderList";

import StatCards from "./components/dashboard/StatCards";
import DomainChart from "./components/dashboard/DomainChart";
import RecentActivity from "./components/dashboard/RecentActivity";

import dashboardService from "./services/dashboardService";
import stockItemService from "./services/stockItemService";
import stockMovementService from "./services/stockMovementService";

/* =========================================
   PROTECTED ROUTE
========================================= */

const ProtectedLayout = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

/* =========================================
   DASHBOARD
========================================= */

const Dashboard = () => {
  const token = useSelector((state) => state.auth?.token);

  const [stats, setStats] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setDashboardLoading(true);

        const [statsData, stockItemsData, movementsData] = await Promise.all([
          dashboardService.getStats(),
          stockItemService.getAll(),
          stockMovementService.getAllMovements(),
        ]);

        setStats(statsData);

        setStockItems(Array.isArray(stockItemsData) ? stockItemsData : []);

        setRecentMovements(Array.isArray(movementsData) ? movementsData : []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  /* =========================================
     INVENTORY BY CATEGORY
  ========================================= */

  const categoryData = Object.values(
    stockItems.reduce((acc, item) => {
      const category = item.category || "Uncategorized";

      const quantity = Number(item.currentQuantity) || 0;

      if (!acc[category]) {
        acc[category] = {
          label: category,
          value: 0,
        };
      }

      acc[category].value += quantity;

      return acc;
    }, {})
  );

  return (
    <div className="dashboard-home">
      {/* =====================================
          HERO
      ===================================== */}

      <section className="hero-section">
        <h1>WareWing Command Center</h1>

        <p>Inventory Management Dashboard</p>
      </section>

      {/* =====================================
          STAT CARDS
      ===================================== */}

      {!dashboardLoading && stats && (
        <StatCards
          stats={[
            {
              label: "Total SKUs",
              value: stats.totalSkus ?? 0,
            },
            {
              label: "Low Stock Alerts",
              value: stats.lowStockAlerts ?? 0,
            },
            {
              label: "Open POs",
              value: stats.openPurchaseOrders ?? 0,
            },
            {
              label: "Active Suppliers",
              value: stats.activeSuppliers ?? 0,
            },
          ]}
        />
      )}

      {/* =====================================
          LOWER DASHBOARD
      ===================================== */}

      {!dashboardLoading && (
        <div className="dashboard-grid">
          <DomainChart title="Inventory by Category" data={categoryData} />

          <RecentActivity activities={recentMovements} />
        </div>
      )}
    </div>
  );
};

/* =========================================
   APP
========================================= */

const App = () => {
  return (
    <Provider store={store}>
      <ErrorHandler>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              {/* ==========================
                  PUBLIC ROUTES
              ========================== */}

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              {/* ==========================
                  DASHBOARD
              ========================== */}

              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                }
              />

              {/* ==========================
                  INVENTORY
              ========================== */}

              <Route
                path="/stock-items"
                element={
                  <ProtectedLayout>
                    <StockItemList />
                  </ProtectedLayout>
                }
              />

              {/* ==========================
                  MOVEMENTS
              ========================== */}

              <Route
                path="/stock-movements"
                element={
                  <ProtectedLayout>
                    <StockMovementList />
                  </ProtectedLayout>
                }
              />

              {/* ==========================
                  SUPPLIERS
              ========================== */}

              <Route
                path="/suppliers"
                element={
                  <ProtectedLayout>
                    <SupplierList />
                  </ProtectedLayout>
                }
              />

              {/* ==========================
                  PURCHASE ORDERS
              ========================== */}

              <Route
                path="/purchase-orders"
                element={
                  <ProtectedLayout>
                    <PurchaseOrderList />
                  </ProtectedLayout>
                }
              />

              {/* ==========================
                  UNKNOWN ROUTE
              ========================== */}

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ErrorHandler>
    </Provider>
  );
};

export default App;
