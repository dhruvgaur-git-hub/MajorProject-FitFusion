package com.fitfusion.userservice.services;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.dtos.RetailerUpdateRequestDto;

public interface RetailerService {

    // GET /api/retailers/profile/{userId} - returns retailer's details
    RetailerResponseDto getProfile(Long userId);

    // PUT /api/retailers/profile/{userId} - lets a retailer fix their own
    // store name, pickup address, or bank details.
    ApiResponse updateProfile(Long userId, RetailerUpdateRequestDto req);

    // DELETE /api/retailers/profile/{userId} - a retailer closing their own
    // store. Soft delete: flips status to CLOSED rather than removing the row.
    ApiResponse closeStore(Long userId);
}
