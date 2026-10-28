package com.example.demo.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
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
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "stockItem" })
@Table(name = "stock_movements")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItem stockItem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType;

    @Column(nullable = false)
    private Integer quantityDelta;

    @Column(nullable = false)
    private Integer previousQuantity;

    @Column(nullable = false)
    private Integer newQuantity;

    private Long referencePoId;

    @Column(nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime movementDate;

    private String notes;

    public enum MovementType {
        INBOUND,
        OUTBOUND,
        ADJUSTMENT,
        REORDER_TRIGGERED
    }

    public StockMovement() {
    }

    public StockMovement(Long id, StockItem stockItem, MovementType movementType, Integer quantityDelta,
            Integer previousQuantity, Integer newQuantity, Long referencePoId, String performedBy,
            LocalDateTime movementDate, String notes) {
        this.id = id;
        this.stockItem = stockItem;
        this.movementType = movementType;
        this.quantityDelta = quantityDelta;
        this.previousQuantity = previousQuantity;
        this.newQuantity = newQuantity;
        this.referencePoId = referencePoId;
        this.performedBy = performedBy;
        this.movementDate = movementDate;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StockItem getStockItem() {
        return stockItem;
    }

    public void setStockItem(StockItem stockItem) {
        this.stockItem = stockItem;
    }

    public MovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(MovementType movementType) {
        this.movementType = movementType;
    }

    public Integer getQuantityDelta() {
        return quantityDelta;
    }

    public void setQuantityDelta(Integer quantityDelta) {
        this.quantityDelta = quantityDelta;
    }

    public Integer getPreviousQuantity() {
        return previousQuantity;
    }

    public void setPreviousQuantity(Integer previousQuantity) {
        this.previousQuantity = previousQuantity;
    }

    public Integer getNewQuantity() {
        return newQuantity;
    }

    public void setNewQuantity(Integer newQuantity) {
        this.newQuantity = newQuantity;
    }

    public Long getReferencePoId() {
        return referencePoId;
    }

    public void setReferencePoId(Long referencePoId) {
        this.referencePoId = referencePoId;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDateTime movementDate) {
        this.movementDate = movementDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @JsonProperty("stockItemId")
    public Long getStockItemId() {
        return stockItem != null ? stockItem.getId() : null;
    }

    @JsonProperty("itemSku")
    public String getItemSku() {
        return stockItem != null ? stockItem.getSku() : null;
    }
}
