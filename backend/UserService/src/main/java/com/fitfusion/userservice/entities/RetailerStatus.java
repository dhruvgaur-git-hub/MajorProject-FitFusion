package com.fitfusion.userservice.entities;

public enum RetailerStatus {
    APPROVED,
    PENDING,
    REJECTED,
    BLOCKED,
    // Retailer closed their own store - (soft delete) 
    CLOSED
}