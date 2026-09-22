package gov.mpin.controller;

import gov.mpin.dto.SightingDtos.CreateSightingRequest;
import gov.mpin.dto.SightingDtos.SightingReportDto;
import gov.mpin.dto.SightingDtos.UpdateSightingStatusRequest;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.SightingReportService;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Sighting Reports", description = "Citizen sighting submissions and police review endpoints")
public class SightingReportController {

    private final SightingReportService sightingReportService;

    @PostMapping("/sightings")
    @Operation(summary = "Submit a sighting report (Public, no authentication required)")
    public ResponseEntity<SightingReportDto> createReport(@Valid @RequestBody CreateSightingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sightingReportService.createReport(request));
    }

    @GetMapping("/sightings")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "List all citizen sighting reports (Police Officer & Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<SightingReportDto>> listReports() {
        return ResponseEntity.ok(sightingReportService.listAllReports());
    }

    @GetMapping("/cases/{caseId}/sightings")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN', 'VOLUNTEER')")
    @Operation(summary = "List sighting reports for a specific case", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<SightingReportDto>> listReportsForCase(@PathVariable String caseId) {
        return ResponseEntity.ok(sightingReportService.listReportsForCase(caseId));
    }

    @PatchMapping("/sightings/{id}/status")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Update sighting report status (VERIFY / REJECT)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<SightingReportDto> updateStatus(
        @PathVariable String id,
        @Valid @RequestBody UpdateSightingStatusRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(sightingReportService.updateStatus(id, request, actor));
    }
}
