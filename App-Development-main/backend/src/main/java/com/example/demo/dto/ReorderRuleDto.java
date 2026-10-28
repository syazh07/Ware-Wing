package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReorderRuleDto {
    @NotNull
    private Long stockItemId;

    @Min(0)
    private Integer minimumThreshold;

    @Min(1)
    private Integer reorderQuantity;

    private Long preferredSupplierId;

    private Boolean autoReorderEnabled;

    public ReorderRuleDto() {
    }

    public ReorderRuleDto(Long stockItemId, Integer minimumThreshold,
                          Integer reorderQuantity, Long preferredSupplierId,
                          Boolean autoReorderEnabled) {
        this.stockItemId = stockItemId;
        this.minimumThreshold = minimumThreshold;
        this.reorderQuantity = reorderQuantity;
        this.preferredSupplierId = preferredSupplierId;
        this.autoReorderEnabled = autoReorderEnabled;
    }

    public Long getStockItemId() {
        return stockItemId;
    }

    public void setStockItemId(Long stockItemId) {
        this.stockItemId = stockItemId;
    }

    public Integer getMinimumThreshold() {
        return minimumThreshold;
    }

    public void setMinimumThreshold(Integer minimumThreshold) {
        this.minimumThreshold = minimumThreshold;
    }

    public Integer getReorderQuantity() {
        return reorderQuantity;
    }

    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }

    public Long getPreferredSupplierId() {
        return preferredSupplierId;
    }

    public void setPreferredSupplierId(Long preferredSupplierId) {
        this.preferredSupplierId = preferredSupplierId;
    }

    public Boolean getAutoReorderEnabled() {
        return autoReorderEnabled;
    }

    public void setAutoReorderEnabled(Boolean autoReorderEnabled) {
        this.autoReorderEnabled = autoReorderEnabled;
    }
}
