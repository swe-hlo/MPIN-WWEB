package gov.mpin.controller;

import gov.mpin.dto.InvestigationDtos.AddNoteRequest;
import gov.mpin.dto.InvestigationDtos.InvestigationNoteDto;
import gov.mpin.dto.InvestigationDtos.TimelineEventDto;
import gov.mpin.security.UserPrincipal;
import gov.mpin.service.InvestigationService;
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
@RequestMapping("/api/cases/{caseId}")
@RequiredArgsConstructor
@Tag(name = "Investigation", description = "Investigation notes and case timeline endpoints")
public class InvestigationController {

    private final InvestigationService investigationService;

    @GetMapping("/notes")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Get investigation notes for a case (Police & Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<InvestigationNoteDto>> getNotes(@PathVariable String caseId) {
        return ResponseEntity.ok(investigationService.getNotesForCase(caseId));
    }

    @PostMapping("/notes")
    @PreAuthorize("hasAnyRole('POLICE_OFFICER', 'SUPER_ADMIN')")
    @Operation(summary = "Add an investigation note to a case", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<InvestigationNoteDto> addNote(
        @PathVariable String caseId,
        @Valid @RequestBody AddNoteRequest request,
        @AuthenticationPrincipal UserPrincipal actor
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(investigationService.addNote(caseId, request, actor));
    }

    @GetMapping("/timeline")
    @Operation(summary = "Get timeline events history for a case")
    public ResponseEntity<List<TimelineEventDto>> getTimeline(@PathVariable String caseId) {
        return ResponseEntity.ok(investigationService.getTimelineForCase(caseId));
    }
}
