package com.example.demo.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Table(name="stock_items")
public class StockItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    @Column(nullable = false,unique = true)
    private String sku;
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private Integer currentQuantity=0;
    @Column(nullable = false)
    private String unit="PCS";
    @Column(nullable = false)
    private Integer minimumThreshold;
    @Column(nullable = false)
    private Integer reorderQuantity;
    @Column(nullable = false,precision = 10,scale = 2)
    private BigDecimal unitPrice;
    private Long preferredSupplierId;
    @Column(nullable = false)
    private Boolean autoReorderEnabled=true;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status=ItemStatus.ACTIVE;

    @OneToMany(mappedBy = "stockItem",cascade = CascadeType.ALL)
    private List<StockMovement> stockMovements;

    public enum ItemStatus{ 
        ACTIVE,
        INACTIVE,
        DISCONTINUED
    }

    public StockItem() {
    }

    public StockItem(Long id, String sku, String username, String category, Integer currentQuantity, String unit,
            Integer minimumThreshold, Integer reorderQuantity, BigDecimal unitPrice, Long preferredSupplierId,
            Boolean autoReorderEnabled, ItemStatus status, List<StockMovement> stockMovements) {
        this.id = id;
        this.sku = sku;
        this.username = username;
        this.category = category;
        this.currentQuantity = currentQuantity;
        this.unit = unit;
        this.minimumThreshold = minimumThreshold;
        this.reorderQuantity = reorderQuantity;
        this.unitPrice = unitPrice;
        this.preferredSupplierId = preferredSupplierId;
        this.autoReorderEnabled = autoReorderEnabled;
        this.status = status;
        this.stockMovements = stockMovements;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public List<StockMovement> getStockMovements() {
        return stockMovements;
    }

    public void setStockMovements(List<StockMovement> stockMovements) {
        this.stockMovements = stockMovements;
    }

    

    


}
