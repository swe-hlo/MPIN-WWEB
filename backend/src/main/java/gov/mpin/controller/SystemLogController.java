package gov.mpin.controller;

import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.dto.NotificationLogDtos.SystemLogDto;
import gov.mpin.service.SystemLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "System audit logs and activity trail")
@SecurityRequirement(name = "bearerAuth")
public class SystemLogController {

    private final SystemLogService systemLogService;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "List all system audit logs (Super Admin only)")
    public ResponseEntity<List<SystemLogDto>> listLogs() {
        return ResponseEntity.ok(systemLogService.getAllLogs());
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get paginated system audit logs (Super Admin only)")
    public ResponseEntity<PageResponse<SystemLogDto>> getPagedLogs(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(systemLogService.getPagedLogs(page, size));
    }
}
