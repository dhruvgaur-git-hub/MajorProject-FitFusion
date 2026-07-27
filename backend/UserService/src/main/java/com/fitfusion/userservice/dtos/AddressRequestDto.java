package com.fitfusion.userservice.dtos;

import com.fitfusion.userservice.entities.AddressType;
import lombok.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequestDto {

    private String name;

    private Long userId;
    private String mobile;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private AddressType addressType;

    private Boolean isDefault;
}