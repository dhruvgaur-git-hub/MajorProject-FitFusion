package com.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandRequest {
	
	@NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 50, message = "Brand name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Brand code is required")
    @Size(min = 2, max = 8, message = "Brand code must be between 2 and 8 characters")
    @Pattern(
        regexp = "^[a-zA-Z0-9]+$",
        message = "Brand code must contain only letters and numbers"
    )
    private String code;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

}
