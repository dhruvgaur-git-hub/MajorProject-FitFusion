package com.fitfusion.customer.dtos;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChangePasswordRequestDto {

    private String oldPassword;

    private String newPassword;
}