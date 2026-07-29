package com.fitfusion.userservice.dtos;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChangePasswordRequestDto {

    private String oldPassword;

    private String newPassword;
}