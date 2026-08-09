/*
 * package com.fitfusion.userservice.entities;
 * 
 * import java.util.ArrayList; import java.util.List;
 * 
 * import com.fitfusion.userservice.entities.User;
 * 
 * import jakarta.persistence.*; import lombok.AllArgsConstructor; import
 * lombok.Data; import lombok.NoArgsConstructor;
 * 
 * 
 * public class Customer {
 * 
 * @Id
 * 
 * @Column(name = "customer_id") private Long customerId;
 * 
 * @OneToOne(fetch = FetchType.LAZY)
 * 
 * @MapsId
 * 
 * @JoinColumn(name = "customer_id") private User user;
 * 
 * @OneToMany( mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval =
 * true ) private List<Address> addresses = new ArrayList<>(); }
 */