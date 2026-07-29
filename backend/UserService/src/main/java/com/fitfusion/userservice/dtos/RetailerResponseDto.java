package com.fitfusion.userservice.dtos;

import com.fitfusion.userservice.entities.RetailerStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RetailerResponseDto {
    private Long retailerId;
    private String name;
    private String email;
    private String mobile;
    private String storeName;
    private String pickupAddress;
    private String gstinNo;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private RetailerStatus status;
}
