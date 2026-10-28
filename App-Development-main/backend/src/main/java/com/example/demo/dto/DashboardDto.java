package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class DashboardDto {
    private long totalSkus;
    private long lowStockAlerts;
    private long openPurchaseOrders;
    private long activeSuppliers;
    private List<Map<String, Object>> stockByCategory;

    public DashboardDto() {
    }

    public DashboardDto(long totalSkus,
                        long lowStockAlerts,
                        long openPurchaseOrders,
                        long activeSuppliers,
                        List<Map<String, Object>> stockByCategory) {
        this.totalSkus = totalSkus;
        this.lowStockAlerts = lowStockAlerts;
        this.openPurchaseOrders = openPurchaseOrders;
        this.activeSuppliers = activeSuppliers;
        this.stockByCategory = stockByCategory;
    }

    public long getTotalSkus() {
        return totalSkus;
    }

    public void setTotalSkus(long totalSkus) {
        this.totalSkus = totalSkus;
    }

    public long getLowStockAlerts() {
        return lowStockAlerts;
    }

    public void setLowStockAlerts(long lowStockAlerts) {
        this.lowStockAlerts = lowStockAlerts;
    }

    public long getOpenPurchaseOrders() {
        return openPurchaseOrders;
    }

    public void setOpenPurchaseOrders(long openPurchaseOrders) {
        this.openPurchaseOrders = openPurchaseOrders;
    }

    public long getActiveSuppliers() {
        return activeSuppliers;
    }

    public void setActiveSuppliers(long activeSuppliers) {
        this.activeSuppliers = activeSuppliers;
    }

    public List<Map<String, Object>> getStockByCategory() {
        return stockByCategory;
    }

    public void setStockByCategory(List<Map<String, Object>> stockByCategory) {
        this.stockByCategory = stockByCategory;
    }   
}
