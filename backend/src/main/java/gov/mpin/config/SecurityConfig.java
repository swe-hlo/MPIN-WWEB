package gov.mpin.config;

import gov.mpin.security.JwtAuthenticationFilter;
import gov.mpin.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/forgot-password").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Authenticated user common endpoints
                .requestMatchers("/api/users/me", "/api/auth/change-password", "/api/notifications/**").authenticated()

                // Super Admin only
                .requestMatchers("/api/admin/**", "/api/logs/**").hasRole("SUPER_ADMIN")

                // Departments and Police Stations management (Admin can write, authenticated can read)
                .requestMatchers(HttpMethod.GET, "/api/departments/**", "/api/stations/**").permitAll()
                .requestMatchers("/api/departments/**", "/api/stations/**").hasRole("SUPER_ADMIN")

                // User management
                .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("SUPER_ADMIN", "POLICE_OFFICER")
                .requestMatchers("/api/users/**").hasRole("SUPER_ADMIN")

                // Police Officer & Admin case management
                .requestMatchers(HttpMethod.POST, "/api/cases/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/cases/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/cases/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")
                .requestMatchers("/api/notes/**", "/api/police/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")

                // Volunteer features
                .requestMatchers("/api/volunteer/**").hasAnyRole("VOLUNTEER", "POLICE_OFFICER", "SUPER_ADMIN")

                // Sighting reviews (Police / Admin)
                .requestMatchers(HttpMethod.PATCH, "/api/sightings/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/sightings/**").hasAnyRole("POLICE_OFFICER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/sightings").permitAll()

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
