package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder,Long> {
    List<PurchaseOrder> findByStatus(PurchaseOrder.OrderStatus status);
    long countByStatus(PurchaseOrder.OrderStatus status);
    @Modifying
    @Query(value = "DELETE FROM purchase_order_lines WHERE stock_item_id=:itemId", nativeQuery=true)
    void deleteLinesByStockItemId(@Param("itemId") Long itemId);

    @Modifying
    @Query(value = "DELETE FROM purchase_order_lines WHERE po_id IN(SELECT id FROM purchase_orders WHERE supplier_id=:supplierId)",nativeQuery = true)
    void deleteLinesBySupplierId(@Param("supplierId") Long supplierId);
    void deleteBySupplier_Id(Long supplierId);
}
