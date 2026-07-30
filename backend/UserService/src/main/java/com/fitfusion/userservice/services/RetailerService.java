package com.fitfusion.userservice.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.dtos.RetailerUpdateRequestDto;
import com.fitfusion.userservice.entities.Retailer;
import com.fitfusion.userservice.entities.RetailerStatus;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.RetailerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RetailerService {

    private final RetailerRepository retailerRepo;
    private final ModelMapper modelMapper;

    // GET /api/retailers/profile/{userId} - returns retailer's details 
    public RetailerResponseDto getProfile(Long userId) {
        Retailer retailer = retailerRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer not found with id: " + userId));

        RetailerResponseDto dto = modelMapper.map(retailer, RetailerResponseDto.class);

        // setting name/email/mobile from the related User
        if (retailer.getUser() != null) {
            dto.setName(retailer.getUser().getName());
            dto.setEmail(retailer.getUser().getEmail());
            dto.setMobile(retailer.getUser().getMobile());
        }

        return dto;
    }

    // PUT /api/retailers/profile/{userId} - lets a retailer fix their own
    // store name, pickup address, or bank details.
    public ApiResponse updateProfile(Long userId, RetailerUpdateRequestDto req) {
        Retailer retailer = retailerRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer not found with id: " + userId));

        retailer.setStoreName(req.getStoreName());
        retailer.setPickupAddress(req.getPickupAddress());
        retailer.setAccountNumber(req.getAccountNumber());
        retailer.setIfscCode(req.getIfscCode());
        retailer.setBankName(req.getBankName());

        retailerRepo.save(retailer);
        return new ApiResponse("SUCCESS", "Retailer profile updated successfully");
    }

    // DELETE /api/retailers/profile/{userId} - a retailer closing their own
    // store. Soft delete: flips status to CLOSED rather than removing the row.
    public ApiResponse closeStore(Long userId) {
        Retailer retailer = retailerRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer not found with id: " + userId));

        retailer.setStatus(RetailerStatus.CLOSED);
        retailerRepo.save(retailer);
        return new ApiResponse("SUCCESS", "Retailer store closed successfully");
    }
}
