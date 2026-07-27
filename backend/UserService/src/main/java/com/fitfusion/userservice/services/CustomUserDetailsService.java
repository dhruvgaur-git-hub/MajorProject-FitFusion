package com.fitfusion.userservice.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fitfusion.userservice.entities.User;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
    	User user= userRepo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("user doesnt exists with this email"));
    	return org.springframework.security.core.userdetails.User
    			.withUsername(user.getEmail())
    			.password(user.getPassword())
    			.authorities("ROLE_"+user.getRole().name())
    			.build();

    }
}