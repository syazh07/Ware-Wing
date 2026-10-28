package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class StockMovementDto {
    @NotNull
    private Long stockItemId;
    @NotNull
    private String movementType;
    @NotNull
    private Integer quantityDelta;
    private Long referencePoId;
    private String notes;
    public StockMovementDto() {
    }
    public StockMovementDto(@NotNull Long stockItemId, @NotNull String movementType, @NotNull Integer quantityDelta,
            Long referencePoId, String notes) {
        this.stockItemId = stockItemId;
        this.movementType = movementType;
        this.quantityDelta = quantityDelta;
        this.referencePoId = referencePoId;
        this.notes = notes;
    }
    public Long getStockItemId() {
        return stockItemId;
    }
    public void setStockItemId(Long stockItemId) {
        this.stockItemId = stockItemId;
    }
    public String getMovementType() {
        return movementType;
    }
    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }
    public Integer getQuantityDelta() {
        return quantityDelta;
    }
    public void setQuantityDelta(Integer quantityDelta) {
        this.quantityDelta = quantityDelta;
    }
    public Long getReferencePoId() {
        return referencePoId;
    }
    public void setReferencePoId(Long referencePoId) {
        this.referencePoId = referencePoId;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
}
