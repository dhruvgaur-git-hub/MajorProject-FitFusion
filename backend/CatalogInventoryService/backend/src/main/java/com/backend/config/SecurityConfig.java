package com.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.backend.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
        	.cors(cors -> cors.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Swagger / API docs
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

                // ---------- PUBLIC READ (browsing) ----------
                .requestMatchers(HttpMethod.GET,
                        "/api/categories/fetchAllCategories",
                        "/api/categories/fetchById/**",
                        "/api/categories/fetchSubCatsByCatId/**",
                        "/api/subcategories/fetchAllSubCategories",
                        "/api/subcategories/fetchById/**",
                        "/api/brands/fetchAllBrands",
                        "/api/brands/fetchById/**",
                        "/api/attribute/fetchAll",
                        "/api/attribute/fetchById/**",
                        "/api/products/catalog",
                        "/api/products/{id}",
                        "/api/products/category/**",
                        "/api/products/brand/**",
                        "/api/products/subCategory/**",
                        "/api/inventory/variant/*/retailer/*"
                ).permitAll()

                // Service-to-service: OrderService deducts stock after payment confirmation.
                // No customer JWT is available/forwarded for this internal call.
                .requestMatchers(HttpMethod.PUT,
                        "/api/inventory/variant/*/retailer/*/reduce"
                ).permitAll()

                // ---------- ADMIN ONLY ----------
                .requestMatchers(HttpMethod.POST,
                        "/api/categories/addcategory",
                        "/api/subcategories/addSubCategory",
                        "/api/brands/addbrand",
                        "/api/attribute/addAttribute"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT,
                        "/api/categories/updateById/**",
                        "/api/subcategories/updateById/**",
                        "/api/brands/updateById/**",
                        "/api/attribute/*"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE,
                        "/api/categories/deleteById/**",
                        "/api/subcategories/deleteById/**",
                        "/api/brands/deleteById/**",
                        "/api/attribute/*"
                ).hasRole("ADMIN")

                .requestMatchers(
                        "/api/categories/stats",
                        "/api/subcategories/stats",
                        "/api/brands/stats",
                        "/api/products",
                        "/api/products/pending",
                        "/api/products/stats"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.PATCH,
                		"/api/products/*/status"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE,
                        "/api/products/*"
                ).hasRole("ADMIN")

                // ---------- RETAILER ONLY ----------
                .requestMatchers(HttpMethod.GET,
                        "/api/attribute/fetchBySubCategory/**",
                        "/api/products/my-products"
                		
                ).hasRole("RETAILER")
                
                .requestMatchers(HttpMethod.POST,
                        "/api/products/addProduct",
                        "/api/products/*/variant",
                        "/api/inventory/addinventory"
                ).hasRole("RETAILER")

                .requestMatchers(HttpMethod.PUT,
                        "/api/products/*",
                        "/api/products/*/variant/*",
                        "/api/inventory/*"
                ).hasRole("RETAILER")

                .requestMatchers(HttpMethod.DELETE,
                        "/api/products/*/variant/*"
                ).hasRole("RETAILER")

                .requestMatchers(
                        "/api/inventory/retailer",
                        "/api/inventory/retailer/variant/**"
                ).hasRole("RETAILER")

                // ---------- everything else requires login ----------
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}