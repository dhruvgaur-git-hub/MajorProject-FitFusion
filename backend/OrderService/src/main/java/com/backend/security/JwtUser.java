package com.backend.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtUser {
	private Long userId;
	private String email;
	private String role;
}