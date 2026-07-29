package com.fitfusion.userservice.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.dtos.RetailerUpdateRequestDto;
import com.fitfusion.userservice.services.RetailerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/retailers")
@RequiredArgsConstructor
public class RetailerController {

    private final RetailerService retailerService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<RetailerResponseDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(retailerService.getProfile(userId));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse> updateProfile(
            @PathVariable Long userId,
            @RequestBody RetailerUpdateRequestDto req) {

        return ResponseEntity.ok(retailerService.updateProfile(userId, req));
    }

    // Soft delete - closes the retailer's own store (status -> CLOSED)
    // rather than removing the row.
    @DeleteMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse> closeStore(@PathVariable Long userId) {
        return ResponseEntity.ok(retailerService.closeStore(userId));
    }
}
