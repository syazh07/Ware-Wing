package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PurchaseOrderDto;
import com.example.demo.dto.PurchaseOrderLineDto;
import com.example.demo.entity.PurchaseOrder;
import com.example.demo.entity.StockItem;
import com.example.demo.entity.StockMovement;
import com.example.demo.entity.Supplier;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PurchaseOrderRepository;
import com.example.demo.repository.StockItemRepository;
import com.example.demo.repository.StockMovementRepository;
import com.example.demo.repository.SupplierRepository;

@Service
@Transactional
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final StockItemRepository stockItemRepository;
    private final StockMovementRepository stockMovementRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                SupplierRepository supplierRepository,
                                StockItemRepository stockItemRepository,
                                StockMovementRepository stockMovementRepository) {

        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.stockItemRepository = stockItemRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder createDraftPo(PurchaseOrderDto dto) {

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier not found with id : " + dto.getSupplierId()));

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        purchaseOrder.setSupplier(supplier);
        purchaseOrder.setPoNumber("PO-" + System.currentTimeMillis());
        purchaseOrder.setOrderDate(LocalDateTime.now());
        purchaseOrder.setExpectedDelivery(dto.getExpectedDelivery());
        purchaseOrder.setOrderedBy("SYSTEM");
        purchaseOrder.setStatus(PurchaseOrder.OrderStatus.DRAFT);

        List<PurchaseOrder.PurchaseOrderLine> lines = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseOrderLineDto lineDto : dto.getLines()) {

            StockItem stockItem = stockItemRepository.findById(lineDto.getStockItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Stock Item not found with id : " + lineDto.getStockItemId()));

            PurchaseOrder.PurchaseOrderLine line =
                    new PurchaseOrder.PurchaseOrderLine();

            line.setStockItem(stockItem);
            line.setOrderedQuantity(lineDto.getOrderedQuantity());
            line.setReceivedQuantity(0);
            line.setUnitPrice(stockItem.getUnitPrice());

            lines.add(line);
            //Total Amount = Σ(Unit Price × Ordered Quantity)
            totalAmount = totalAmount.add(
                    stockItem.getUnitPrice().multiply(
                            BigDecimal.valueOf(lineDto.getOrderedQuantity())));
        }

        purchaseOrder.setLines(lines);
        purchaseOrder.setTotalAmount(totalAmount);

        return purchaseOrderRepository.save(purchaseOrder);
    }

    public void submitPo(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase Order not found with id : " + id));

        purchaseOrder.setStatus(PurchaseOrder.OrderStatus.SUBMITTED);

        purchaseOrderRepository.save(purchaseOrder);
    }

    public void approvePo(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase Order not found with id : " + id));

        purchaseOrder.setStatus(PurchaseOrder.OrderStatus.APPROVED);

        purchaseOrderRepository.save(purchaseOrder);
    }

    public void receivePo(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase Order not found with id : " + id));

        purchaseOrder.setStatus(PurchaseOrder.OrderStatus.RECEIVED);

        for (PurchaseOrder.PurchaseOrderLine line : purchaseOrder.getLines()) {

            StockItem stockItem = line.getStockItem();

            int previousQty = stockItem.getCurrentQuantity();
            int newQty = previousQty + line.getOrderedQuantity();

            stockItem.setCurrentQuantity(newQty);
            stockItemRepository.save(stockItem);

            line.setReceivedQuantity(line.getOrderedQuantity());

            StockMovement movement = new StockMovement();
            movement.setStockItem(stockItem);
            movement.setMovementType(StockMovement.MovementType.INBOUND);
            movement.setQuantityDelta(line.getOrderedQuantity());
            movement.setPreviousQuantity(previousQty);
            movement.setNewQuantity(newQty);
            movement.setReferencePoId(purchaseOrder.getId());
            movement.setPerformedBy("SYSTEM");
            movement.setMovementDate(LocalDateTime.now());
            movement.setNotes("Purchase Order Received");

            stockMovementRepository.save(movement);
        }

        purchaseOrderRepository.save(purchaseOrder);
    }

    public void deletePo(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase Order not found with id : " + id));

        purchaseOrderRepository.delete(purchaseOrder);
    }
}