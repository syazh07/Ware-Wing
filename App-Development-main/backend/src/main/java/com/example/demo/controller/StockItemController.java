package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DashboardDto;
import com.example.demo.dto.StockItemDto;
import com.example.demo.entity.StockItem;
import com.example.demo.service.StockItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stock-items")
@Validated
public class StockItemController {

    private final StockItemService stockItemService;

    public StockItemController(StockItemService stockItemService) {
        this.stockItemService = stockItemService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','VIEWER')")
    public ResponseEntity<List<StockItem>> getAll() {
        return ResponseEntity.ok(stockItemService.getAllItems());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','VIEWER')")
    public ResponseEntity<DashboardDto> getDashboardStats() {
        return ResponseEntity.ok(stockItemService.getDashboardStats());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> create(@Valid @RequestBody StockItemDto dto) {
        stockItemService.createItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("StockItem created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> update(@PathVariable Long id,
            @Valid @RequestBody StockItemDto dto) {
        stockItemService.updateItem(id, dto);
        return ResponseEntity.ok("StockItem updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        stockItemService.deleteItem(id);
        return ResponseEntity.ok("StockItem deleted successfully.");
    }

   
}