package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class SupplierDto {
    @NotBlank
    private String name;
    @NotBlank
    private String contactEmail;
    private String phone;
    private Integer leadTimeDays;
    private String status;
    public SupplierDto() {
    }
    public SupplierDto(@NotBlank String name, @NotBlank String contactEmail, String phone, Integer leadTimeDays,
            String status) {
        this.name = name;
        this.contactEmail = contactEmail;
        this.phone = phone;
        this.leadTimeDays = leadTimeDays;
        this.status = status;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getContactEmail() {
        return contactEmail;
    }
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public Integer getLeadTimeDays() {
        return leadTimeDays;
    }
    public void setLeadTimeDays(Integer leadTimeDays) {
        this.leadTimeDays = leadTimeDays;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    
}
