package com.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "return_actions")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReturnActions {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long returnActionId;
	
	
	@ManyToOne
	@JoinColumn(name = "return_request_id", nullable = false)
	@ToString.Exclude
	@JsonIgnore
	private ReturnRequests returnRequest;
	
	@Column(nullable = false)
	private Long adminId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ReturnActionStatus action;
	
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	public enum ReturnActionStatus{
		REVIEWED, APPROVED, REJECTED, PICKUP_SCHEDULED, ITEM_RECEIVED, COMPLETED
	}
	
}
