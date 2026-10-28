package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByContactEmail(String contactEmail);

    long countByStatus(Supplier.SupplierStatus status);
}
