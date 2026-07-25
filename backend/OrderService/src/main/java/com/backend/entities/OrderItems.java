package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "order_items")
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItems {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orderItemId;
	
	@ManyToOne
	@JoinColumn(name = "order_id",  nullable= false)
	@ToString.Exclude
	@JsonIgnore
	private Orders order;
	
	@Column(nullable = false)
	private String productId;
	
	@Column(nullable = false)
	private String variantId;
	
	@Column(nullable = false)
	private String sku;
	
	@Column(nullable = false)
	private String productName;
	
	@Column(nullable = false)
	private Long retailerId;
	
	@Column(nullable = false)
	private Integer quantity;
	
	@Column(nullable = false)
	private Double mrp;    			//6999
	
	@Column(nullable = false)
	private Double retailerQuotedPrice;  //5200
	
	@Column(nullable = false)
	private Double commissionPercent;		//10% ->  5200 + 520 = 5720
	
	@Column(nullable = false)
	private Double discountPercent;			//4% -> 5720 - 4% = 5491
	
	@Column(nullable = false)
	private Double sellingPrice;			//5491
	
	@Column(nullable = false)
	private Double subtotal;	 
	
	@Enumerated(EnumType.STRING)			//profit = 291-> from customer = 551
	@Column(nullable = false)
	private OrderItemStatus status;
	
	public enum OrderItemStatus{
		ACTIVE, RETURNED, EXCHANGED, CANCELLED
	}
	
}







