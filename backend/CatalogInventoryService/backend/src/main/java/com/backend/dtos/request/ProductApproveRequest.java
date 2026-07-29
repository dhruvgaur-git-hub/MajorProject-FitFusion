package com.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;

public class ProductApproveRequest {

    @NotBlank
    private String productCode;

    private String remarks;

}