package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.PurchaseOrderDto;
import com.example.demo.entity.PurchaseOrder;
import com.example.demo.service.PurchaseOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/purchase-orders")
@Validated
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','VIEWER')")
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(purchaseOrderService.createDraftPo(dto));
    }

    @PutMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> submitPurchaseOrder(@PathVariable Long id) {

        purchaseOrderService.submitPo(id);

        return ResponseEntity.ok("Purchase Order submitted successfully.");
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> approvePurchaseOrder(@PathVariable Long id) {

        purchaseOrderService.approvePo(id);

        return ResponseEntity.ok("Purchase Order approved successfully.");
    }

    @PutMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> receivePurchaseOrder(@PathVariable Long id) {

        purchaseOrderService.receivePo(id);

        return ResponseEntity.ok("Purchase Order received successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> deletePurchaseOrder(@PathVariable Long id) {

        purchaseOrderService.deletePo(id);

        return ResponseEntity.ok("Purchase Order deleted successfully.");
    }
}