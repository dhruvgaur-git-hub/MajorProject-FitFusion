package com.backend.dtos;

import com.backend.entities.ReturnRequests.RequestType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReturnRequestDto {

	private Long orderItemId;
	private Long customerId;
	private RequestType requestType;
	private String reason;

}