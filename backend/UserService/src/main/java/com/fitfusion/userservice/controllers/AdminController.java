package com.fitfusion.userservice.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.entities.RetailerStatus;
import com.fitfusion.userservice.services.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // GET /api/admin/retailers?status=PENDING -> only that status
    // GET /api/admin/retailers -> every retailer, any status
    @GetMapping("/retailers")
    public ResponseEntity<List<RetailerResponseDto>> getRetailers(
            @RequestParam(required = false) RetailerStatus status) {

        return ResponseEntity.ok(adminService.getRetailers(status));
    }

    // PATCH /api/admin/retailers/{retailerId}/status?status=APPROVED
    @PatchMapping("/retailers/{retailerId}/status")
    public ResponseEntity<ApiResponse> updateRetailerStatus(
            @PathVariable Long retailerId,
            @RequestParam RetailerStatus status) {

        return ResponseEntity.ok(adminService.updateRetailerStatus(retailerId, status));
    }
}
