package gov.mpin.config;

import gov.mpin.entity.UserEntity;
import gov.mpin.enums.UserRole;
import gov.mpin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ensureUser("u-admin", "System Administrator", "admin@mpin.gov.in", "admin123", UserRole.SUPER_ADMIN, "+91 90000 00001", null, null);
        ensureUser("u-officer", "Inspector Rajesh Kumar", "police@mpin.gov.in", "police123", UserRole.POLICE_OFFICER, "+91 90000 00002", "d-1", "ps-1");
        ensureUser("u-volunteer", "Anita Sharma", "volunteer@mpin.gov.in", "volunteer123", UserRole.VOLUNTEER, "+91 90000 00003", null, null);
        ensureUser("u-public", "Ravi Verma", "public@mpin.gov.in", "public123", UserRole.PUBLIC_USER, "+91 90000 00004", null, null);
    }

    private void ensureUser(String id, String fullName, String email, String plainPassword, UserRole role, String phone, String departmentId, String stationId) {
        userRepository.findByEmailIgnoreCase(email).ifPresentOrElse(
            user -> {
                user.setPasswordHash(passwordEncoder.encode(plainPassword));
                user.setActive(true);
                userRepository.save(user);
                log.info("Verified demo user credentials for: {}", email);
            },
            () -> {
                UserEntity user = UserEntity.builder()
                    .id(id)
                    .fullName(fullName)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(plainPassword))
                    .role(role)
                    .phone(phone)
                    .departmentId(departmentId)
                    .stationId(stationId)
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                userRepository.save(user);
                log.info("Created demo user: {}", email);
            }
        );
    }
}
