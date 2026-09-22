package gov.mpin.controller;

import gov.mpin.dto.DepartmentStationDtos.CreateDepartmentRequest;
import gov.mpin.dto.DepartmentStationDtos.DepartmentDto;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Tag(name = "Departments", description = "Police Department management endpoints")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "List all police departments")
    public ResponseEntity<List<DepartmentDto>> listDepartments() {
        return ResponseEntity.ok(departmentService.listDepartments());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new department (Super Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<DepartmentDto> createDepartment(
        @Valid @RequestBody CreateDepartmentRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(request, actor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete department by ID (Super Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, String>> deleteDepartment(
        @PathVariable String id,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        departmentService.deleteDepartment(id, actor);
        return ResponseEntity.ok(Map.of("message", "Department removed successfully."));
    }
}
