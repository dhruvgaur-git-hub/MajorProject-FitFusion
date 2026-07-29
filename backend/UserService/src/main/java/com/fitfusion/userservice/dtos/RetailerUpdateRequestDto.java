package com.fitfusion.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// gstinNo and status are immutable by the retailer themselves, so they are not included in this DTO.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RetailerUpdateRequestDto {
    private String storeName;
    private String pickupAddress;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
}
