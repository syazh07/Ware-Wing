package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.StockMovementDto;
import com.example.demo.entity.StockItem;
import com.example.demo.entity.StockMovement;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.StockItemRepository;
import com.example.demo.repository.StockMovementRepository;

@Service
@Transactional
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final StockItemRepository stockItemRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository,
                                StockItemRepository stockItemRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.stockItemRepository = stockItemRepository;
    }

    public List<StockMovement> getAllMovements() {
        return stockMovementRepository.findAllWithStockItem();
    }

    public StockMovement recordMovement(StockMovementDto dto) {

        StockItem stockItem = stockItemRepository.findById(dto.getStockItemId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stock Item not found with id : "
                                        + dto.getStockItemId()));

        int previousQuantity = stockItem.getCurrentQuantity();
        int newQuantity = previousQuantity;

        StockMovement.MovementType movementType =
                StockMovement.MovementType.valueOf(
                        dto.getMovementType().toUpperCase());

        switch (movementType) {

            case INBOUND:
                newQuantity = previousQuantity + dto.getQuantityDelta();
                break;

            case OUTBOUND:

                if (previousQuantity < dto.getQuantityDelta()) {
                    throw new BusinessValidationException(
                            "Insufficient stock.");
                }

                newQuantity = previousQuantity - dto.getQuantityDelta();
                break;

            case ADJUSTMENT:
                newQuantity = dto.getQuantityDelta();
                break;

            case REORDER_TRIGGERED:
                newQuantity = previousQuantity + dto.getQuantityDelta();
                break;
        }

        stockItem.setCurrentQuantity(newQuantity);
        stockItemRepository.save(stockItem);

        StockMovement movement = new StockMovement();

        movement.setStockItem(stockItem);
        movement.setMovementType(movementType);
        movement.setQuantityDelta(dto.getQuantityDelta());
        movement.setPreviousQuantity(previousQuantity);
        movement.setNewQuantity(newQuantity);
        movement.setReferencePoId(dto.getReferencePoId());
        movement.setPerformedBy("SYSTEM");
        movement.setMovementDate(LocalDateTime.now());
        movement.setNotes(dto.getNotes());

        return stockMovementRepository.save(movement);
    }

    public void deleteMovementsByItemId(Long itemId) {

        stockItemRepository.findById(itemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stock Item not found with id : " + itemId));

        stockMovementRepository.deleteByStockItem_Id(itemId);
    }

    public List<StockMovement> getMovementsByStockItem(Long itemId) {

        stockItemRepository.findById(itemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stock Item not found with id : " + itemId));

        return stockMovementRepository
                .findByStockItem_IdOrderByMovementDateDesc(itemId);
    }

    public void deleteMovement(Long id) {

        StockMovement movement = stockMovementRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stock Movement not found with id : " + id));

        stockMovementRepository.delete(movement);
    }
}