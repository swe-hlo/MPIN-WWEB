package gov.mpin.controller;

import gov.mpin.dto.AuthDtos.UpdateUserRoleRequest;
import gov.mpin.dto.AuthDtos.UserDto;
import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.enums.UserRole;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management and roster endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List users with optional role filtering and pagination")
    public ResponseEntity<PageResponse<UserDto>> listUsers(
        @RequestParam(required = false) UserRole role,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(userService.listUsers(role, page, size));
    }

    @GetMapping("/volunteers")
    @Operation(summary = "Get list of all active volunteers for case assignment")
    public ResponseEntity<List<UserDto>> listVolunteers() {
        return ResponseEntity.ok(userService.listVolunteers());
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Toggle user active/inactive status (Super Admin only)")
    public ResponseEntity<UserDto> toggleActive(
        @PathVariable String id,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(userService.toggleActive(id, actor));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user role (Super Admin only)")
    public ResponseEntity<UserDto> updateRole(
        @PathVariable String id,
        @Valid @RequestBody UpdateUserRoleRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(userService.updateRole(id, request.getRole(), actor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete user account (Super Admin only)")
    public ResponseEntity<Map<String, String>> deleteUser(
        @PathVariable String id,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        userService.deleteUser(id, actor);
        return ResponseEntity.ok(Map.of("message", "User removed successfully."));
    }
}
