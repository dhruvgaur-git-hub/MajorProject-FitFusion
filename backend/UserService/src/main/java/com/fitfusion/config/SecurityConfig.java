package com.fitfusion.config;

import com.fitfusion.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf->csrf.disable())
		.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.authorizeHttpRequests(auth->auth.requestMatchers("/users/login", "/users/register/customer","/users/register/retailer").permitAll()
				 .requestMatchers("/users/profile").hasAnyRole("CUSTOMER", "RETAILER")
				    .requestMatchers("/retailers/**").hasRole("RETAILER")
				    
				    .requestMatchers(HttpMethod.PUT, "/users/editprofile")
		            .hasAnyRole("CUSTOMER", "RETAILER")
		            
		            .requestMatchers(HttpMethod.PUT, "/users/changepassword")
		            .hasAnyRole("CUSTOMER", "RETAILER")
		            
		            .requestMatchers(HttpMethod.DELETE, "/users")
		            .hasAnyRole("CUSTOMER", "RETAILER")
		            
		            
				.anyRequest().authenticated())
		.addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class);
		return http.build();
		
	}
	@Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }
}
