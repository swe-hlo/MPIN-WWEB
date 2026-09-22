package gov.mpin.controller;

import gov.mpin.dto.CaseDtos.*;
import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.enums.CaseStatus;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.MissingPersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Missing Persons", description = "Missing person case management, public search, and volunteer coordination")
public class MissingPersonController {

    private final MissingPersonService missingPersonService;

    // --- Public Search & Detail Endpoints (Privacy Masked) ---

    @GetMapping("/public/cases")
    @Operation(summary = "Search missing persons public database with multi-criteria filters")
    public ResponseEntity<PageResponse<PublicCaseDto>> searchPublicCases(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String gender,
        @RequestParam(required = false) String state,
        @RequestParam(required = false) String district,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) CaseStatus status,
        @RequestParam(required = false) Integer minAge,
        @RequestParam(required = false) Integer maxAge,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false) String stationId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size
    ) {
        CaseSearchFilter filter = CaseSearchFilter.builder()
            .search(search)
            .gender(gender)
            .state(state)
            .district(district)
            .city(city)
            .status(status)
            .minAge(minAge)
            .maxAge(maxAge)
            .from(from)
            .to(to)
            .stationId(stationId)
            .page(page)
            .size(size)
            .build();
        return ResponseEntity.ok(missingPersonService.searchPublicCases(filter));
    }

    @GetMapping("/public/cases/{id}")
    @Operation(summary = "Get public profile of a missing person by ID")
    public ResponseEntity<PublicCaseDto> getPublicCase(@PathVariable String id) {
        return ResponseEntity.ok(missingPersonService.getPublicCase(id));
    }

    // --- Authenticated Police / Admin Case Management Endpoints ---

    @GetMapping("/cases")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN', 'VOLUNTEER')")
    @Operation(summary = "Search internal case database with full details", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PageResponse<CaseDetailDto>> searchOfficerCases(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String gender,
        @RequestParam(required = false) String state,
        @RequestParam(required = false) String district,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) CaseStatus status,
        @RequestParam(required = false) Integer minAge,
        @RequestParam(required = false) Integer maxAge,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(required = false) String stationId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        CaseSearchFilter filter = CaseSearchFilter.builder()
            .search(search)
            .gender(gender)
            .state(state)
            .district(district)
            .city(city)
            .status(status)
            .minAge(minAge)
            .maxAge(maxAge)
            .from(from)
            .to(to)
            .stationId(stationId)
            .page(page)
            .size(size)
            .build();
        return ResponseEntity.ok(missingPersonService.searchOfficerCases(filter));
    }

    @GetMapping("/cases/{id}")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN', 'VOLUNTEER')")
    @Operation(summary = "Get internal full case detail by ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CaseDetailDto> getCaseDetail(@PathVariable String id) {
        return ResponseEntity.ok(missingPersonService.getOfficerCaseDetail(id));
    }

    @PostMapping("/cases")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Register a new missing person case", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CaseDetailDto> createCase(
        @Valid @RequestBody CreateCaseRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(missingPersonService.createCase(request, actor));
    }

    @PutMapping("/cases/{id}")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Update missing person case details", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CaseDetailDto> updateCase(
        @PathVariable String id,
        @Valid @RequestBody UpdateCaseRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(missingPersonService.updateCase(id, request, actor));
    }

    @PatchMapping("/cases/{id}/status")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Update case status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CaseDetailDto> updateCaseStatus(
        @PathVariable String id,
        @Valid @RequestBody UpdateCaseStatusRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(missingPersonService.updateStatus(id, request.getStatus(), actor));
    }

    @PostMapping("/cases/{id}/assign-volunteer")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Assign volunteer to case", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<CaseDetailDto> assignVolunteer(
        @PathVariable String id,
        @Valid @RequestBody AssignVolunteerRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.ok(missingPersonService.assignVolunteer(id, request.getVolunteerId(), actor));
    }

    @GetMapping("/volunteer/assigned-cases")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Get cases assigned to current volunteer", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<CaseDetailDto>> getAssignedCases(@AuthenticationPrincipal UserPrincipal actor) {
        return ResponseEntity.ok(missingPersonService.getCasesAssignedToVolunteer(actor.getId()));
    }
}
