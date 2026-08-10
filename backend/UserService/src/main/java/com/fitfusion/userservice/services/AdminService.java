package com.fitfusion.userservice.services;

import java.util.List;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.entities.RetailerStatus;

public interface AdminService {

    // GET /api/admin/retailers?status=X - status given -> only retailers with
    // that status. No status -> every retailer, any status.
    List<RetailerResponseDto> getRetailers(RetailerStatus status);

    // PATCH /api/admin/retailers/{retailerId}/status - approve/reject/block.
    ApiResponse updateRetailerStatus(Long retailerId, RetailerStatus status);
}
