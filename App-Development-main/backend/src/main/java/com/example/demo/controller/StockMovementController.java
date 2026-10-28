package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.StockMovementDto;
import com.example.demo.entity.StockMovement;
import com.example.demo.service.StockMovementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stock-movements")
@Validated
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','VIEWER')")
    public ResponseEntity<List<StockMovement>> getAllMovements() {
        return ResponseEntity.ok(stockMovementService.getAllMovements());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<StockMovement> recordMovement(
            @Valid @RequestBody StockMovementDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(stockMovementService.recordMovement(dto));
    }
}