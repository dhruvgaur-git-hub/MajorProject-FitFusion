package com.fitfusion.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRegisterRequestDto {
	private String name;
	private String email;
	private String password;
	private String mobile;
}
