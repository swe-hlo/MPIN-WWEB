package gov.mpin.service;

import gov.mpin.dto.InvestigationDtos.AddNoteRequest;
import gov.mpin.dto.InvestigationDtos.InvestigationNoteDto;
import gov.mpin.dto.InvestigationDtos.TimelineEventDto;
import gov.mpin.entity.InvestigationNoteEntity;
import gov.mpin.entity.MissingPersonEntity;
import gov.mpin.entity.TimelineEventEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.enums.TimelineEventType;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.InvestigationNoteRepository;
import gov.mpin.repository.MissingPersonRepository;
import gov.mpin.repository.TimelineEventRepository;
import gov.mpin.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestigationService {

    private final InvestigationNoteRepository investigationNoteRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final MissingPersonRepository missingPersonRepository;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public List<InvestigationNoteDto> getNotesForCase(String caseId) {
        return investigationNoteRepository.findByPersonIdOrderByCreatedAtDesc(caseId).stream()
            .map(this::mapNoteToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public InvestigationNoteDto addNote(String caseId, AddNoteRequest request, UserPrincipal actor) {
        MissingPersonEntity person = missingPersonRepository.findById(caseId)
            .orElseThrow(() -> new ResourceNotFoundException("Case not found"));

        String noteId = "note-" + UUID.randomUUID().toString().substring(0, 8);
        InvestigationNoteEntity entity = InvestigationNoteEntity.builder()
            .id(noteId)
            .person(person)
            .authorId(actor != null ? actor.getId() : "u-officer")
            .authorName(actor != null ? actor.getFullName() : "Investigating Officer")
            .note(request.getNote().trim())
            .createdAt(LocalDateTime.now())
            .build();

        investigationNoteRepository.save(entity);

        // Add timeline event
        TimelineEventEntity timelineEvent = TimelineEventEntity.builder()
            .id("tl-" + UUID.randomUUID().toString().substring(0, 8))
            .person(person)
            .type(TimelineEventType.NOTE_ADDED)
            .message("Investigation note added by " + entity.getAuthorName() + ".")
            .createdAt(LocalDateTime.now())
            .build();
        timelineEventRepository.save(timelineEvent);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "Officer",
            "ADD_INVESTIGATION_NOTE",
            "MissingPerson",
            caseId,
            LogLevel.INFO
        );

        return mapNoteToDto(entity);
    }

    @Transactional(readOnly = true)
    public List<TimelineEventDto> getTimelineForCase(String caseId) {
        return timelineEventRepository.findByPersonIdOrderByCreatedAtDesc(caseId).stream()
            .map(this::mapTimelineToDto)
            .collect(Collectors.toList());
    }

    public InvestigationNoteDto mapNoteToDto(InvestigationNoteEntity entity) {
        return InvestigationNoteDto.builder()
            .id(entity.getId())
            .caseId(entity.getPerson().getId())
            .authorId(entity.getAuthorId())
            .authorName(entity.getAuthorName())
            .note(entity.getNote())
            .createdAt(entity.getCreatedAt())
            .build();
    }

    public TimelineEventDto mapTimelineToDto(TimelineEventEntity entity) {
        return TimelineEventDto.builder()
            .id(entity.getId())
            .caseId(entity.getPerson().getId())
            .type(entity.getType())
            .message(entity.getMessage())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
