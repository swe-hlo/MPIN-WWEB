package gov.mpin.controller;

import gov.mpin.dto.DepartmentStationDtos.CreateStationRequest;
import gov.mpin.dto.DepartmentStationDtos.PoliceStationDto;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.PoliceStationService;
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
@RequestMapping("/api/stations")
@RequiredArgsConstructor
@Tag(name = "Police Stations", description = "Police Station management endpoints")
public class PoliceStationController {

    private final PoliceStationService policeStationService;

    @GetMapping
    @Operation(summary = "List all police stations")
    public ResponseEntity<List<PoliceStationDto>> listStations() {
        return ResponseEntity.ok(policeStationService.listStations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get police station details by ID")
    public ResponseEntity<PoliceStationDto> getStation(@PathVariable String id) {
        return ResponseEntity.ok(policeStationService.getStation(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create a new police station (Super Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<PoliceStationDto> createStation(
        @Valid @RequestBody CreateStationRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(policeStationService.createStation(request, actor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete police station by ID (Super Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, String>> deleteStation(
        @PathVariable String id,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        policeStationService.deleteStation(id, actor);
        return ResponseEntity.ok(Map.of("message", "Police Station removed successfully."));
    }
}
