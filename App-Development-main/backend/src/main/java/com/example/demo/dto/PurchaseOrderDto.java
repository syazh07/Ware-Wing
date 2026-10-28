package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class PurchaseOrderDto {
    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private LocalDate expectedDelivery;

    @NotEmpty(message = "Purchase order must have at least one line")
    private List<PurchaseOrderLineDto> lines;

    public PurchaseOrderDto() {
    }

    public PurchaseOrderDto(Long supplierId, LocalDate expectedDelivery,
            List<PurchaseOrderLineDto> lines) {
        this.supplierId = supplierId;
        this.expectedDelivery = expectedDelivery;
        this.lines = lines;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getExpectedDelivery() {
        return expectedDelivery;
    }

    public void setExpectedDelivery(LocalDate expectedDelivery) {
        this.expectedDelivery = expectedDelivery;
    }

    public List<PurchaseOrderLineDto> getLines() {
        return lines;
    }

    public void setLines(List<PurchaseOrderLineDto> lines) {
        this.lines = lines;
    }
}
