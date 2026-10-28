package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PurchaseOrderLineDto {
    @NotNull(message = "Stock Item ID is required")
    private Long stockItemId;

    @NotNull
    @Min(value = 1, message = "Ordered quantity must be at least 1")
    private Integer orderedQuantity;

    public PurchaseOrderLineDto() {
    }

    public PurchaseOrderLineDto(Long stockItemId, Integer orderedQuantity) {
        this.stockItemId = stockItemId;
        this.orderedQuantity = orderedQuantity;
    }

    public Long getStockItemId() {
        return stockItemId;
    }

    public void setStockItemId(Long stockItemId) {
        this.stockItemId = stockItemId;
    }

    public Integer getOrderedQuantity() {
        return orderedQuantity;
    }

    public void setOrderedQuantity(Integer orderedQuantity) {
        this.orderedQuantity = orderedQuantity;
    }
}
