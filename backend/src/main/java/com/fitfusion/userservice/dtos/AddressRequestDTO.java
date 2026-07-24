package com.fitfusion.userservice.dtos;

import com.fitfusion.userservice.entities.AddressType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequestDTO {

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
}