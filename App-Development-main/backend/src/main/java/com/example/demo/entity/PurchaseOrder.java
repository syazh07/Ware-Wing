package com.example.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "purchase_orders")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    @Column(nullable = false, unique = true)
    private String poNumber;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
    private String orderedBy;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDate expectedDelivery;
    @ElementCollection
    @CollectionTable(name = "purchase_order_lines", joinColumns = @JoinColumn(name = "po_id"))
    private List<PurchaseOrderLine> lines = new ArrayList<>();

    public PurchaseOrder() {
    }

    public PurchaseOrder(Long id, String poNumber, Supplier supplier, String orderedBy, BigDecimal totalAmount,
            OrderStatus status, LocalDateTime orderDate, LocalDate expectedDelivery, List<PurchaseOrderLine> lines) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplier = supplier;
        this.orderedBy = orderedBy;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.expectedDelivery = expectedDelivery;
        this.lines = lines;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPoNumber() {
        return poNumber;
    }

    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public String getOrderedBy() {
        return orderedBy;
    }

    public void setOrderedBy(String orderedBy) {
        this.orderedBy = orderedBy;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getExpectedDelivery() {
        return expectedDelivery;
    }

    public void setExpectedDelivery(LocalDate expectedDelivery) {
        this.expectedDelivery = expectedDelivery;
    }

    public List<PurchaseOrderLine> getLines() {
        return lines;
    }

    public void setLines(List<PurchaseOrderLine> lines) {
        this.lines = lines;
    }

    @Embeddable
    public static class PurchaseOrderLine {
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "stock_item_id", nullable = false)
        private StockItem stockItem;

        @Column(nullable = false)
        private Integer orderedQuantity;

        @Column(nullable = false)
        private Integer receivedQuantity = 0;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal unitPrice;

        public PurchaseOrderLine() {
        }

        public PurchaseOrderLine(StockItem stockItem, Integer orderedQuantity, Integer receivedQuantity,
                BigDecimal unitPrice) {
            this.stockItem = stockItem;
            this.orderedQuantity = orderedQuantity;
            this.receivedQuantity = receivedQuantity;
            this.unitPrice = unitPrice;
        }

        public StockItem getStockItem() {
            return stockItem;
        }

        public void setStockItem(StockItem stockItem) {
            this.stockItem = stockItem;
        }

        public Integer getOrderedQuantity() {
            return orderedQuantity;
        }

        public void setOrderedQuantity(Integer orderedQuantity) {
            this.orderedQuantity = orderedQuantity;
        }

        public Integer getReceivedQuantity() {
            return receivedQuantity;
        }

        public void setReceivedQuantity(Integer receivedQuantity) {
            this.receivedQuantity = receivedQuantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

    }

    public enum OrderStatus {
        DRAFT,
        SUBMITTED,
        APPROVED,
        RECEIVED,
        CANCELLED

    }
}
