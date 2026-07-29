package com.fitfusion.customer.dtos;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UpdateCustomerRequestDto {

    private String name;

    private String mobile;
}