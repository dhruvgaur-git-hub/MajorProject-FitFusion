package com.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Embeddable
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ShippingAddress {
	
	@Column(name = "shipping_name", nullable = false)
	private String name;
	
	@Column(name = "shipping_mobile", nullable = false)
    private String mobile;
	
	@Column(name = "shipping_address_line_1", nullable = false)
    private String addressLine1;
	
	@Column(name = "shipping_address_line_2")
    private String addressLine2;
	
	@Column(name = "shipping_city", nullable = false)
    private String city;
	
	@Column(name = "shipping_state", nullable = false)
    private String state;
	
	@Column(name = "shipping_country", nullable = false)
    private String country;
	
	@Column(name = "shipping_pincode", length = 6, nullable = false)
    private String pincode;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "shipping_address_type")
	private AddressType addresstype;
	
	public enum AddressType{
		HOME, WORK, OTHER
	}
	
	
}
