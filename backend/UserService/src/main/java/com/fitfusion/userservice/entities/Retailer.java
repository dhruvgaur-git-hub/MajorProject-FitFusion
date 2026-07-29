package com.fitfusion.userservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "retailers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Retailer {

    @Id
    @Column(name = "retailer_id")
    private Long retailerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "retailer_id")
    private User user;

    @Column(nullable = false)
    private String storeName;

    @Column(length = 600, nullable = false)
    private String pickupAddress;

    @Column(nullable = false, length = 15)
    private String gstinNo;

    @Column(nullable = false, length = 20)
    private String accountNumber;

    @Column(nullable = false, length =11)
    private String ifscCode;

    @Column(nullable = false)
    private String bankName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RetailerStatus status = RetailerStatus.PENDING;
}