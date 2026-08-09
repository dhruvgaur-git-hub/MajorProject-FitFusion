package com.fitfusion.userservice.dtos;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
    private String status;
    private LocalDateTime timeStamp;
    private String message;

    public ApiResponse(String status, String message) {
        super();
        this.status = status;
        this.message = message;
        this.timeStamp = LocalDateTime.now();
    }
}