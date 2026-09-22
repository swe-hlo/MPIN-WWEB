package gov.mpin.service;

import gov.mpin.dto.SightingDtos.CreateSightingRequest;
import gov.mpin.dto.SightingDtos.SightingReportDto;
import gov.mpin.dto.SightingDtos.UpdateSightingStatusRequest;
import gov.mpin.entity.MissingPersonEntity;
import gov.mpin.entity.SightingReportEntity;
import gov.mpin.entity.TimelineEventEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.enums.NotificationType;
import gov.mpin.enums.SightingStatus;
import gov.mpin.enums.TimelineEventType;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.MissingPersonRepository;
import gov.mpin.repository.SightingReportRepository;
import gov.mpin.repository.TimelineEventRepository;
import gov.mpin.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SightingReportService {

    private final SightingReportRepository sightingReportRepository;
    private final MissingPersonRepository missingPersonRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final NotificationService notificationService;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public List<SightingReportDto> listAllReports() {
        return sightingReportRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SightingReportDto> listReportsForCase(String caseId) {
        return sightingReportRepository.findByCaseIdOrderByCreatedAtDesc(caseId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public SightingReportDto createReport(CreateSightingRequest request) {
        String id = "sr-" + UUID.randomUUID().toString().substring(0, 8);
        SightingReportEntity entity = SightingReportEntity.builder()
            .id(id)
            .caseId(StringUtils.hasText(request.getCaseId()) ? request.getCaseId().trim() : null)
            .reporterName(request.getReporterName().trim())
            .contactNumber(request.getContactNumber().trim())
            .sightingDate(request.getDate())
            .sightingTime(request.getTime())
            .location(request.getLocation().trim())
            .mapsLink(request.getMapsLink())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .status(SightingStatus.NEW)
            .createdAt(LocalDateTime.now())
            .build();

        sightingReportRepository.save(entity);

        // If linked to a case, add timeline event and notify assigned officers / volunteers
        if (StringUtils.hasText(entity.getCaseId())) {
            missingPersonRepository.findById(entity.getCaseId()).ifPresent(person -> {
                TimelineEventEntity timelineEvent = TimelineEventEntity.builder()
                    .id("tl-" + UUID.randomUUID().toString().substring(0, 8))
                    .person(person)
                    .type(TimelineEventType.SIGHTING_REPORTED)
                    .message("New citizen sighting reported at " + entity.getLocation() + ".")
                    .createdAt(LocalDateTime.now())
                    .build();
                timelineEventRepository.save(timelineEvent);

                if (person.getRegisteredByUserId() != null) {
                    notificationService.createNotification(
                        person.getRegisteredByUserId(),
                        NotificationType.NEW_REPORT,
                        "New Sighting Reported",
                        "A sighting was reported for case " + person.getCaseNumber() + " at " + entity.getLocation() + ".",
                        person.getId()
                    );
                }
            });
        }

        systemLogService.log(
            null,
            entity.getReporterName(),
            "REPORT_SIGHTING",
            "SightingReport",
            id,
            LogLevel.INFO
        );

        return mapToDto(entity);
    }

    @Transactional
    public SightingReportDto updateStatus(String id, UpdateSightingStatusRequest request, UserPrincipal actor) {
        SightingReportEntity entity = sightingReportRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sighting report not found"));

        entity.setStatus(request.getStatus());
        sightingReportRepository.save(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "Officer",
            "UPDATE_SIGHTING_STATUS",
            "SightingReport",
            id,
            LogLevel.INFO
        );

        return mapToDto(entity);
    }

    public SightingReportDto mapToDto(SightingReportEntity entity) {
        return SightingReportDto.builder()
            .id(entity.getId())
            .caseId(entity.getCaseId())
            .reporterName(entity.getReporterName())
            .contactNumber(entity.getContactNumber())
            .date(entity.getSightingDate())
            .time(entity.getSightingTime())
            .location(entity.getLocation())
            .mapsLink(entity.getMapsLink())
            .description(entity.getDescription())
            .imageUrl(entity.getImageUrl())
            .status(entity.getStatus())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
