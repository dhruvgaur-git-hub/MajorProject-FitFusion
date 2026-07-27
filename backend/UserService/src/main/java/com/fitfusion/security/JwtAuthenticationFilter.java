package com.fitfusion.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{
	private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
	
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		final String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
		    filterChain.doFilter(request, response);
		    return;
		}
		String myjwttoken = authHeader.substring(7);
		String userEmail= jwtService.extractUsername(myjwttoken);
		if(userEmail!=null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails= userDetailsService.loadUserByUsername(userEmail);
			if(jwtService.isTokenValid(myjwttoken, userDetails)) {
				UsernamePasswordAuthenticationToken authToken= new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				/* 
				 * authToken.setDetails(new
				 * WebAuthenticationDetailsSource().buildDetails(request));
				 */
				// We dont need Web Auth Details for our project right now, we may add it later when we want to do auditing, tracking client's ip, etc
			}
		}
		filterChain.doFilter(request, response);

		
		
	}

}
