package com.fitfusion.userservice.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponseDto {

    private String token;
    private String type;
    private String email;
    private String role;
}