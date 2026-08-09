package com.backend.dtos.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductStatsResponse {

    private long total;
    
    private long approved;
    
    private long pending;
    
    private long rejected;
    
    private long active;
    
    private long inactive;
}

