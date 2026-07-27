package com.fitfusion.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RetailerRegisterRequestDto {
	private String name;
	private String email;
	private String password;
	private String mobile;

	private String storeName;
	private String pickupAddress;
	private String gstinNo;
	private String accountNumber;
	private String ifscCode;
	private String bankName;
}
