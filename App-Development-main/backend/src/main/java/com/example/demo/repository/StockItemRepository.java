package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.StockItem;

public interface StockItemRepository extends JpaRepository<StockItem,Long>  {
    Optional<StockItem>findByUsername(String username);
    boolean existsByUsername(String username);
    List<StockItem> findByCurrentQuantityLessThan(Integer threshold);
    @Query("SELECT COUNT(s) FROM StockItem s WHERE s.currentQuantity<=s.minimumThreshold") 
    Long countLowStockItems();
}
