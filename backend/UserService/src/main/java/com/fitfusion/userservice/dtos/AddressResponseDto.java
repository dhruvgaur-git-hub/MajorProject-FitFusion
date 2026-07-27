package com.fitfusion.userservice.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fitfusion.userservice.entities.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponseDto {
    
    private Long addressId;

    private Long userId;

    private String name;

    private String mobile;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private AddressType addressType;

    private Boolean isDefault;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}