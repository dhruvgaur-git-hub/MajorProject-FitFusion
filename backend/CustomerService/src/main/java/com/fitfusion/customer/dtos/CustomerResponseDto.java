package com.fitfusion.customer.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDto {
    private Long customerId;
    private String name;
    private String email;
    private String mobile;
}
