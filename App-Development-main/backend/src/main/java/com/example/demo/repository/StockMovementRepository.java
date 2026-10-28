package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement,Long> {
    @Query("SELECT sm FROM StockMovement sm JOIN FETCH sm.stockItem ORDER BY sm.movementDate DESC") 
    List<StockMovement> findAllWithStockItem();
    List<StockMovement> findByStockItem_IdOrderByMovementDateDesc(Long itemId);
    @Modifying
    void deleteByStockItem_Id(Long itemId);
}
