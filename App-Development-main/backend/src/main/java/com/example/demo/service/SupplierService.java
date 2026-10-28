package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.SupplierDto;
import com.example.demo.entity.Supplier;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PurchaseOrderRepository;
import com.example.demo.repository.SupplierRepository;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public SupplierService(SupplierRepository supplierRepository,
                           PurchaseOrderRepository purchaseOrderRepository) {
        this.supplierRepository = supplierRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier createSupplier(SupplierDto dto) {

        if (supplierRepository.findByContactEmail(dto.getContactEmail()).isPresent()) {
            throw new BusinessValidationException(
                    "Supplier email already exists.");
        }

        Supplier supplier = new Supplier();

        supplier.setName(dto.getName());
        supplier.setContactEmail(dto.getContactEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setLeadTimeDays(dto.getLeadTimeDays());

        if (dto.getStatus() != null) {
            supplier.setStatus(
                    Supplier.SupplierStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        // reliabilityScore defaults to 100 in the entity

        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, SupplierDto dto) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id : " + id));

        supplier.setName(dto.getName());
        supplier.setContactEmail(dto.getContactEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setLeadTimeDays(dto.getLeadTimeDays());

        if (dto.getStatus() != null) {
            supplier.setStatus(
                    Supplier.SupplierStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {

        supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id : " + id));

        purchaseOrderRepository.deleteLinesBySupplierId(id);
        purchaseOrderRepository.deleteBySupplier_Id(id);

        supplierRepository.deleteById(id);
    }

    public void recalculateSupplierReliability(Long supplierId) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id : " + supplierId));

        /*
         * Placeholder implementation.
         * Modify this logic if your SRS specifies a reliability calculation.
         */
        supplier.setReliabilityScore(100);

        supplierRepository.save(supplier);
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found with id : " + id));
    }

    public long getActiveSupplierCount() {
        return supplierRepository.countByStatus(Supplier.SupplierStatus.ACTIVE);
    }
}