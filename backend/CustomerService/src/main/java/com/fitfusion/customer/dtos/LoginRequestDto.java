package com.fitfusion.customer.dtos;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {
	private String email;
    private String password;
}
