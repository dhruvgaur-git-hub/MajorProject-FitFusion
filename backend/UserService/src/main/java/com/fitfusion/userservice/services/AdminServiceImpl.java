package com.fitfusion.userservice.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.RetailerResponseDto;
import com.fitfusion.userservice.entities.Retailer;
import com.fitfusion.userservice.entities.RetailerStatus;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.RetailerRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final RetailerRepository retailerRepo;
    private final ModelMapper modelMapper;

    @Override
    public List<RetailerResponseDto> getRetailers(RetailerStatus status) {
        List<Retailer> retailers;
        if (status != null) {
            retailers = retailerRepo.findByStatus(status);
        } else {
            retailers = retailerRepo.findAll();
        }

        List<RetailerResponseDto> responseList = new ArrayList<>();
        for (Retailer retailer : retailers) {
            RetailerResponseDto dto = modelMapper.map(retailer, RetailerResponseDto.class);

            // setting name/email/mobile from the related User
            if (retailer.getUser() != null) {
                dto.setName(retailer.getUser().getName());
                dto.setEmail(retailer.getUser().getEmail());
                dto.setMobile(retailer.getUser().getMobile());
            }

            responseList.add(dto);
        }
        return responseList;
    }

    @Override
    public ApiResponse updateRetailerStatus(Long retailerId, RetailerStatus status) {
        Retailer retailer = retailerRepo.findById(retailerId)
                .orElseThrow(() -> new ResourceNotFoundException("Retailer not found with id: " + retailerId));

        retailer.setStatus(status);
        retailerRepo.save(retailer);
        return new ApiResponse("SUCCESS", "Retailer status updated to " + status + " for ID: " + retailerId);
    }
}
