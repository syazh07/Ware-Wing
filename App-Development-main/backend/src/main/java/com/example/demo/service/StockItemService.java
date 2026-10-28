package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DashboardDto;
import com.example.demo.dto.StockItemDto;
import com.example.demo.entity.PurchaseOrder;
import com.example.demo.entity.StockItem;
import com.example.demo.entity.Supplier;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PurchaseOrderRepository;
import com.example.demo.repository.StockItemRepository;
import com.example.demo.repository.SupplierRepository;

@Service
@Transactional
public class StockItemService {

    private final StockItemRepository stockItemRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public StockItemService(StockItemRepository stockItemRepository,
            SupplierRepository supplierRepository,
            PurchaseOrderRepository purchaseOrderRepository) {
        this.stockItemRepository = stockItemRepository;
        this.supplierRepository = supplierRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public List<StockItem> getAllItems() {
        return stockItemRepository.findAll();
    }

    public StockItem createItem(StockItemDto dto) {

        if (stockItemRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessValidationException(
                    "Stock item already exists with name : " + dto.getUsername());
        }

        supplierRepository.findById(dto.getPreferredSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier not found with id : " + dto.getPreferredSupplierId()));

        StockItem item = new StockItem();
        item.setSku(dto.getSku());
        item.setUsername(dto.getUsername());
        item.setCategory(dto.getCategory());
        item.setCurrentQuantity(dto.getCurrentQuantity());
        item.setUnit(dto.getUnit());
        item.setMinimumThreshold(dto.getMinimumThreshold());
        item.setReorderQuantity(dto.getReorderQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setPreferredSupplierId(dto.getPreferredSupplierId());
        item.setAutoReorderEnabled(dto.getAutoReorderEnabled());
        if (dto.getStatus() != null) {
            item.setStatus(StockItem.ItemStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        StockItem saved = stockItemRepository.save(item);

        if (Boolean.TRUE.equals(saved.getAutoReorderEnabled())
                && saved.getCurrentQuantity() <= saved.getMinimumThreshold()) {
            triggerAutoReorder(saved);
        }
        return saved;

        //  return null;
    }

    public StockItem updateItem(Long id, StockItemDto dto) {

        StockItem item = stockItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock Item not found with id : " + id));

        supplierRepository.findById(dto.getPreferredSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier not found with id : " + dto.getPreferredSupplierId()));

        item.setSku(dto.getSku());
        item.setUsername(dto.getUsername());
        item.setCategory(dto.getCategory());
        item.setCurrentQuantity(dto.getCurrentQuantity());
        item.setUnit(dto.getUnit());
        item.setMinimumThreshold(dto.getMinimumThreshold());
        item.setReorderQuantity(dto.getReorderQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setPreferredSupplierId(dto.getPreferredSupplierId());
        item.setAutoReorderEnabled(dto.getAutoReorderEnabled());
        if (dto.getStatus() != null) {
            item.setStatus(StockItem.ItemStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        StockItem updated = stockItemRepository.save(item);

        if (Boolean.TRUE.equals(updated.getAutoReorderEnabled())
                && updated.getCurrentQuantity() <= updated.getMinimumThreshold()) {
            triggerAutoReorder(updated);
        }

        return updated;
    }

    

    private void triggerAutoReorder(StockItem item) {

        if (item.getPreferredSupplierId() == null) {
            return;
        }

        Supplier supplier = supplierRepository.findById(item.getPreferredSupplierId()).orElse(null);
        if (supplier == null) {
            return;
        }

        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber("AUTO-" + System.currentTimeMillis());
        po.setSupplier(supplier);
        po.setOrderedBy("SYSTEM");
        po.setOrderDate(LocalDateTime.now());
        po.setExpectedDelivery(
                LocalDate.now().plusDays(supplier.getLeadTimeDays()));
        po.setStatus(PurchaseOrder.OrderStatus.DRAFT);

        PurchaseOrder.PurchaseOrderLine line = new PurchaseOrder.PurchaseOrderLine();
        line.setStockItem(item);
        line.setOrderedQuantity(item.getReorderQuantity());
        line.setReceivedQuantity(0);
        line.setUnitPrice(item.getUnitPrice());

        po.setLines(List.of(line));

        purchaseOrderRepository.save(po);
    }

    public void deleteItem(Long id) {

        StockItem item = stockItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock Item not found with id : " + id));

        purchaseOrderRepository.deleteLinesByStockItemId(id);
        stockItemRepository.delete(item);
    }

    public DashboardDto getDashboardStats() {

        DashboardDto dashboard = new DashboardDto();
        dashboard.setTotalSkus(stockItemRepository.count());
        dashboard.setLowStockAlerts(stockItemRepository.countLowStockItems());
        dashboard.setOpenPurchaseOrders(
                purchaseOrderRepository.countByStatus(PurchaseOrder.OrderStatus.DRAFT));
        dashboard.setActiveSuppliers(
                supplierRepository.countByStatus(Supplier.SupplierStatus.ACTIVE));
        dashboard.setStockByCategory(List.of());

        return dashboard;
    }
}
