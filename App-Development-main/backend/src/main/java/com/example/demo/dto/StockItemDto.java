package com.example.demo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class StockItemDto {
    @NotBlank
    private String sku;
    // @NotBlank
    private String username;
    // @NotBlank
    private String category;
    // @NotNull
    @Min(0)
    private Integer currentQuantity;
    private String unit;
    // @NotNull

    @Min(0)
    private Integer minimumThreshold;
    // @NotNull

    @Min(1)
    private Integer reorderQuantity;
    @Min(0)
    private BigDecimal unitPrice;
    private String status;
    // @NotNull

    private Long preferredSupplierId;
    // @NotNull

    private Boolean autoReorderEnabled;

    public StockItemDto() {
    }

    public StockItemDto(@NotBlank String sku,  String username,  String category,
            @Min(0) Integer currentQuantity, String unit, @Min(0) Integer minimumThreshold,
            @Min(1) Integer reorderQuantity, @Min(0) BigDecimal unitPrice, String status, Long preferredSupplierId,
            Boolean autoReorderEnabled) {
        this.sku = sku;
        this.username = username;
        this.category = category;
        this.currentQuantity = currentQuantity;
        this.unit = unit;
        this.minimumThreshold = minimumThreshold;
        this.reorderQuantity = reorderQuantity;
        this.unitPrice = unitPrice;
        this.status = status;
        this.preferredSupplierId = preferredSupplierId;
        this.autoReorderEnabled = autoReorderEnabled;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(Integer currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    // public enum ItemStatus{
    // ACTIVE,
    // INACTIVE
    // }
}
