package gov.mpin.service;

import gov.mpin.dto.AuthDtos.UserDto;
import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.entity.UserEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.enums.UserRole;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.UserRepository;
import gov.mpin.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public PageResponse<UserDto> listUsers(UserRole role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserEntity> pageResult;
        if (role != null) {
            pageResult = userRepository.findByRole(role, pageable);
        } else {
            pageResult = userRepository.findAll(pageable);
        }

        return PageResponse.<UserDto>builder()
            .content(pageResult.getContent().stream().map(authService::mapToDto).collect(Collectors.toList()))
            .totalElements(pageResult.getTotalElements())
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    @Transactional(readOnly = true)
    public List<UserDto> listVolunteers() {
        Pageable pageable = PageRequest.of(0, 1000, Sort.by(Sort.Direction.ASC, "fullName"));
        return userRepository.findByRole(UserRole.VOLUNTEER, pageable).getContent().stream()
            .map(authService::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserDto toggleActive(String id, UserPrincipal actor) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setActive(!user.isActive());
        userRepository.save(user);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            user.isActive() ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            "User",
            user.getId(),
            LogLevel.INFO
        );

        return authService.mapToDto(user);
    }

    @Transactional
    public UserDto updateRole(String id, UserRole role, UserPrincipal actor) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setRole(role);
        userRepository.save(user);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "UPDATE_USER_ROLE",
            "User",
            user.getId(),
            LogLevel.INFO
        );

        return authService.mapToDto(user);
    }

    @Transactional
    public void deleteUser(String id, UserPrincipal actor) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "DELETE_USER",
            "User",
            id,
            LogLevel.WARN
        );
    }
}
