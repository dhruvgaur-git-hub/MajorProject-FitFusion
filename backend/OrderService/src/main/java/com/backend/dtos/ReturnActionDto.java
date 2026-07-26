package com.backend.dtos;

import com.backend.entities.ReturnActions.ReturnActionStatus;

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
public class ReturnActionDto {

	private Long returnRequestId;
	private Long adminId;
	private ReturnActionStatus action;

}