package com.fitfusion.userservice.dtos;

import java.time.LocalDateTime;

import com.fitfusion.userservice.entities.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
	private Long userId;
	private String name;
	private String email;
	private String mobile;
	private Role role;
	private LocalDateTime createdAt;
}
