package gov.mpin.service;

import gov.mpin.dto.AuthDtos.*;
import gov.mpin.entity.UserEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.exception.BadRequestException;
import gov.mpin.exception.ConflictException;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.exception.UnauthorizedException;
import gov.mpin.repository.UserRepository;
import gov.mpin.security.JwtUtils;
import gov.mpin.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final SystemLogService systemLogService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("No account found with this email."));

        if (!user.isActive()) {
            throw new BadRequestException("Your account has been deactivated. Contact support.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String token = jwtUtils.generateToken(principal);

            systemLogService.log(user.getId(), user.getFullName(), "LOGIN", "User", user.getId(), LogLevel.INFO);

            return AuthResponse.builder()
                .user(mapToDto(user))
                .tokens(AuthTokens.builder()
                    .accessToken(token)
                    .expiresIn(jwtUtils.getExpirationMs() / 1000)
                    .build())
                .build();
        } catch (BadCredentialsException e) {
            throw new UnauthorizedException("Incorrect password.");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ConflictException("An account with this email already exists.");
        }

        String userId = "u-" + UUID.randomUUID().toString().substring(0, 8);
        UserEntity user = UserEntity.builder()
            .id(userId)
            .fullName(request.getFullName().trim())
            .email(request.getEmail().trim().toLowerCase())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .phone(request.getPhone())
            .departmentId(request.getDepartmentId())
            .stationId(request.getStationId())
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        userRepository.save(user);

        systemLogService.log(user.getId(), user.getFullName(), "REGISTER", "User", user.getId(), LogLevel.INFO);

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtUtils.generateToken(principal);

        return AuthResponse.builder()
            .user(mapToDto(user))
            .tokens(AuthTokens.builder()
                .accessToken(token)
                .expiresIn(jwtUtils.getExpirationMs() / 1000)
                .build())
            .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        UserEntity user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDto(user);
    }

    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        UserEntity user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        systemLogService.log(user.getId(), user.getFullName(), "CHANGE_PASSWORD", "User", user.getId(), LogLevel.INFO);
    }

    @Transactional(readOnly = true)
    public void forgotPassword(ForgotPasswordRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("No account found with this email."));

        systemLogService.log(user.getId(), user.getFullName(), "FORGOT_PASSWORD_REQUEST", "User", user.getId(), LogLevel.INFO);
    }

    public UserDto mapToDto(UserEntity user) {
        return UserDto.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole())
            .phone(user.getPhone())
            .avatarUrl(user.getAvatarUrl())
            .departmentId(user.getDepartmentId())
            .stationId(user.getStationId())
            .active(user.isActive())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
