package gov.mpin.service;

import gov.mpin.dto.CaseDtos.*;
import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.entity.*;
import gov.mpin.enums.CaseStatus;
import gov.mpin.enums.Gender;
import gov.mpin.enums.LogLevel;
import gov.mpin.enums.NotificationType;
import gov.mpin.enums.TimelineEventType;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.*;
import gov.mpin.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MissingPersonService {

    private final MissingPersonRepository missingPersonRepository;
    private final PoliceStationRepository policeStationRepository;
    private final VolunteerCaseAssignmentRepository volunteerCaseAssignmentRepository;
    private final TimelineEventRepository timelineEventRepository;
    private final NotificationService notificationService;
    private final SystemLogService systemLogService;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<PublicCaseDto> searchPublicCases(CaseSearchFilter filter) {
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<MissingPersonEntity> spec = createSearchSpecification(filter);
        Page<MissingPersonEntity> pageResult = missingPersonRepository.findAll(spec, pageable);

        Map<String, String> stationNames = getStationNamesMap();

        List<PublicCaseDto> dtos = pageResult.getContent().stream()
            .map(person -> mapToPublicDto(person, stationNames.get(person.getPoliceStationId())))
            .collect(Collectors.toList());

        return PageResponse.<PublicCaseDto>builder()
            .content(dtos)
            .totalElements(pageResult.getTotalElements())
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<CaseDetailDto> searchOfficerCases(CaseSearchFilter filter) {
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<MissingPersonEntity> spec = createSearchSpecification(filter);
        Page<MissingPersonEntity> pageResult = missingPersonRepository.findAll(spec, pageable);

        Map<String, String> stationNames = getStationNamesMap();

        List<CaseDetailDto> dtos = pageResult.getContent().stream()
            .map(person -> mapToDetailDto(person, stationNames.get(person.getPoliceStationId())))
            .collect(Collectors.toList());

        return PageResponse.<CaseDetailDto>builder()
            .content(dtos)
            .totalElements(pageResult.getTotalElements())
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    @Transactional(readOnly = true)
    public PublicCaseDto getPublicCase(String id) {
        MissingPersonEntity person = missingPersonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Missing person case not found"));

        String stationName = policeStationRepository.findById(person.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToPublicDto(person, stationName);
    }

    @Transactional(readOnly = true)
    public CaseDetailDto getOfficerCaseDetail(String id) {
        MissingPersonEntity person = missingPersonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Missing person case not found"));

        String stationName = policeStationRepository.findById(person.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToDetailDto(person, stationName);
    }

    @Transactional
    public CaseDetailDto createCase(CreateCaseRequest request, UserPrincipal actor) {
        String id = "mp-" + UUID.randomUUID().toString().substring(0, 8);
        long totalCases = missingPersonRepository.count();
        String caseNumber = String.format("MPN/%d/%03d", Year.now().getValue(), totalCases + 101);

        MissingPersonEntity entity = MissingPersonEntity.builder()
            .id(id)
            .fullName(request.getFullName().trim())
            .nickName(request.getNickName())
            .gender(request.getGender())
            .dob(request.getDob())
            .age(request.getAge())
            .height(request.getHeight())
            .weight(request.getWeight())
            .bloodGroup(request.getBloodGroup())
            .skinTone(request.getSkinTone())
            .hairColor(request.getHairColor())
            .eyeColor(request.getEyeColor())
            .identificationMarks(request.getIdentificationMarks())
            .medicalConditions(request.getMedicalConditions())
            .mentalHealthCondition(request.getMentalHealthCondition())
            .lastSeenDate(request.getLastSeenDate())
            .lastSeenTime(request.getLastSeenTime())
            .lastSeenLocation(request.getLastSeenLocation().trim())
            .state(request.getState().trim())
            .district(request.getDistrict().trim())
            .city(request.getCity())
            .missingCircumstances(request.getMissingCircumstances())
            .clothingDescription(request.getClothingDescription())
            .guardianName(request.getGuardianName())
            .guardianContact(request.getGuardianContact())
            .policeStationId(request.getPoliceStationId())
            .firNumber(request.getFirNumber())
            .caseNumber(caseNumber)
            .status(CaseStatus.MISSING)
            .priority(request.getPriority())
            .registeredByUserId(actor != null ? actor.getId() : null)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (int i = 0; i < request.getImages().size(); i++) {
                String imgUrl = request.getImages().get(i);
                if (StringUtils.hasText(imgUrl)) {
                    entity.getImages().add(MissingPersonImageEntity.builder()
                        .id("img-" + UUID.randomUUID().toString().substring(0, 8))
                        .person(entity)
                        .imageUrl(imgUrl)
                        .displayOrder(i)
                        .createdAt(LocalDateTime.now())
                        .build());
                }
            }
        }

        missingPersonRepository.save(entity);

        // Add timeline event
        TimelineEventEntity timelineEvent = TimelineEventEntity.builder()
            .id("tl-" + UUID.randomUUID().toString().substring(0, 8))
            .person(entity)
            .type(TimelineEventType.REGISTERED)
            .message("Case " + caseNumber + " registered by " + (actor != null ? actor.getFullName() : "Officer") + ".")
            .createdAt(LocalDateTime.now())
            .build();
        timelineEventRepository.save(timelineEvent);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "Officer",
            "CREATE_CASE",
            "MissingPerson",
            id,
            LogLevel.INFO
        );

        String stationName = policeStationRepository.findById(entity.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToDetailDto(entity, stationName);
    }

    @Transactional
    public CaseDetailDto updateCase(String id, UpdateCaseRequest request, UserPrincipal actor) {
        MissingPersonEntity entity = missingPersonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Missing person case not found"));

        if (request.getFullName() != null) entity.setFullName(request.getFullName().trim());
        if (request.getNickName() != null) entity.setNickName(request.getNickName());
        if (request.getGender() != null) entity.setGender(request.getGender());
        if (request.getDob() != null) entity.setDob(request.getDob());
        if (request.getAge() != null) entity.setAge(request.getAge());
        if (request.getHeight() != null) entity.setHeight(request.getHeight());
        if (request.getWeight() != null) entity.setWeight(request.getWeight());
        if (request.getBloodGroup() != null) entity.setBloodGroup(request.getBloodGroup());
        if (request.getSkinTone() != null) entity.setSkinTone(request.getSkinTone());
        if (request.getHairColor() != null) entity.setHairColor(request.getHairColor());
        if (request.getEyeColor() != null) entity.setEyeColor(request.getEyeColor());
        if (request.getIdentificationMarks() != null) entity.setIdentificationMarks(request.getIdentificationMarks());
        if (request.getMedicalConditions() != null) entity.setMedicalConditions(request.getMedicalConditions());
        if (request.getMentalHealthCondition() != null) entity.setMentalHealthCondition(request.getMentalHealthCondition());
        if (request.getLastSeenDate() != null) entity.setLastSeenDate(request.getLastSeenDate());
        if (request.getLastSeenTime() != null) entity.setLastSeenTime(request.getLastSeenTime());
        if (request.getLastSeenLocation() != null) entity.setLastSeenLocation(request.getLastSeenLocation().trim());
        if (request.getState() != null) entity.setState(request.getState().trim());
        if (request.getDistrict() != null) entity.setDistrict(request.getDistrict().trim());
        if (request.getCity() != null) entity.setCity(request.getCity());
        if (request.getMissingCircumstances() != null) entity.setMissingCircumstances(request.getMissingCircumstances());
        if (request.getClothingDescription() != null) entity.setClothingDescription(request.getClothingDescription());
        if (request.getGuardianName() != null) entity.setGuardianName(request.getGuardianName());
        if (request.getGuardianContact() != null) entity.setGuardianContact(request.getGuardianContact());
        if (request.getFirNumber() != null) entity.setFirNumber(request.getFirNumber());
        if (request.getPriority() != null) entity.setPriority(request.getPriority());

        if (request.getImages() != null) {
            entity.getImages().clear();
            for (int i = 0; i < request.getImages().size(); i++) {
                String imgUrl = request.getImages().get(i);
                if (StringUtils.hasText(imgUrl)) {
                    entity.getImages().add(MissingPersonImageEntity.builder()
                        .id("img-" + UUID.randomUUID().toString().substring(0, 8))
                        .person(entity)
                        .imageUrl(imgUrl)
                        .displayOrder(i)
                        .createdAt(LocalDateTime.now())
                        .build());
                }
            }
        }

        entity.setUpdatedAt(LocalDateTime.now());
        missingPersonRepository.save(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "Officer",
            "UPDATE_CASE",
            "MissingPerson",
            id,
            LogLevel.INFO
        );

        String stationName = policeStationRepository.findById(entity.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToDetailDto(entity, stationName);
    }

    @Transactional
    public CaseDetailDto updateStatus(String id, CaseStatus newStatus, UserPrincipal actor) {
        MissingPersonEntity entity = missingPersonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Missing person case not found"));

        CaseStatus oldStatus = entity.getStatus();
        entity.setStatus(newStatus);
        entity.setUpdatedAt(LocalDateTime.now());
        missingPersonRepository.save(entity);

        TimelineEventType eventType = newStatus == CaseStatus.FOUND ? TimelineEventType.FOUND : TimelineEventType.STATUS_CHANGE;
        String eventMsg = "Status updated from " + oldStatus + " to " + newStatus + " by " + (actor != null ? actor.getFullName() : "Officer") + ".";

        TimelineEventEntity timelineEvent = TimelineEventEntity.builder()
            .id("tl-" + UUID.randomUUID().toString().substring(0, 8))
            .person(entity)
            .type(eventType)
            .message(eventMsg)
            .createdAt(LocalDateTime.now())
            .build();
        timelineEventRepository.save(timelineEvent);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "Officer",
            "UPDATE_STATUS",
            "MissingPerson",
            id,
            LogLevel.INFO
        );

        String stationName = policeStationRepository.findById(entity.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToDetailDto(entity, stationName);
    }

    @Transactional
    public CaseDetailDto assignVolunteer(String caseId, String volunteerId, UserPrincipal actor) {
        MissingPersonEntity entity = missingPersonRepository.findById(caseId)
            .orElseThrow(() -> new ResourceNotFoundException("Missing person case not found"));

        UserEntity volunteer = userRepository.findById(volunteerId)
            .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found"));

        if (!volunteerCaseAssignmentRepository.existsByPersonIdAndVolunteerId(caseId, volunteerId)) {
            VolunteerCaseAssignmentEntity assignment = VolunteerCaseAssignmentEntity.builder()
                .id("vca-" + UUID.randomUUID().toString().substring(0, 8))
                .person(entity)
                .volunteerId(volunteerId)
                .assignedByUserId(actor != null ? actor.getId() : null)
                .createdAt(LocalDateTime.now())
                .build();
            volunteerCaseAssignmentRepository.save(assignment);
            entity.getVolunteerAssignments().add(assignment);

            // Notify volunteer
            notificationService.createNotification(
                volunteerId,
                NotificationType.ASSIGNMENT,
                "New case assigned",
                "You have been assigned to case " + entity.getCaseNumber() + " (" + entity.getFullName() + ").",
                caseId
            );

            // Add timeline event
            TimelineEventEntity timelineEvent = TimelineEventEntity.builder()
                .id("tl-" + UUID.randomUUID().toString().substring(0, 8))
                .person(entity)
                .type(TimelineEventType.ASSIGNMENT)
                .message("Volunteer " + volunteer.getFullName() + " assigned to case.")
                .createdAt(LocalDateTime.now())
                .build();
            timelineEventRepository.save(timelineEvent);

            systemLogService.log(
                actor != null ? actor.getId() : null,
                actor != null ? actor.getFullName() : "Officer",
                "ASSIGN_VOLUNTEER",
                "MissingPerson",
                caseId,
                LogLevel.INFO
            );
        }

        String stationName = policeStationRepository.findById(entity.getPoliceStationId())
            .map(PoliceStationEntity::getName)
            .orElse("Police Station");

        return mapToDetailDto(entity, stationName);
    }

    @Transactional(readOnly = true)
    public List<CaseDetailDto> getCasesAssignedToVolunteer(String volunteerId) {
        List<MissingPersonEntity> cases = missingPersonRepository.findAssignedToVolunteer(volunteerId);
        Map<String, String> stationNames = getStationNamesMap();

        return cases.stream()
            .map(c -> mapToDetailDto(c, stationNames.get(c.getPoliceStationId())))
            .collect(Collectors.toList());
    }

    private Specification<MissingPersonEntity> createSearchSpecification(CaseSearchFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.getSearch())) {
                String searchPattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate caseNumMatch = cb.like(cb.lower(root.get("caseNumber")), searchPattern);
                Predicate nickNameMatch = cb.like(cb.lower(root.get("nickName")), searchPattern);
                predicates.add(cb.or(nameMatch, caseNumMatch, nickNameMatch));
            }

            if (StringUtils.hasText(filter.getGender())) {
                try {
                    Gender genderEnum = Gender.valueOf(filter.getGender().toUpperCase());
                    predicates.add(cb.equal(root.get("gender"), genderEnum));
                } catch (IllegalArgumentException ignored) {}
            }

            if (StringUtils.hasText(filter.getState())) {
                predicates.add(cb.equal(cb.lower(root.get("state")), filter.getState().trim().toLowerCase()));
            }

            if (StringUtils.hasText(filter.getDistrict())) {
                predicates.add(cb.equal(cb.lower(root.get("district")), filter.getDistrict().trim().toLowerCase()));
            }

            if (StringUtils.hasText(filter.getCity())) {
                predicates.add(cb.equal(cb.lower(root.get("city")), filter.getCity().trim().toLowerCase()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getMinAge() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("age"), filter.getMinAge()));
            }

            if (filter.getMaxAge() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("age"), filter.getMaxAge()));
            }

            if (filter.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("lastSeenDate"), filter.getFrom()));
            }

            if (filter.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("lastSeenDate"), filter.getTo()));
            }

            if (StringUtils.hasText(filter.getStationId())) {
                predicates.add(cb.equal(root.get("policeStationId"), filter.getStationId().trim()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Map<String, String> getStationNamesMap() {
        return policeStationRepository.findAll().stream()
            .collect(Collectors.toMap(PoliceStationEntity::getId, PoliceStationEntity::getName, (a, b) -> a));
    }

    public PublicCaseDto mapToPublicDto(MissingPersonEntity entity, String stationName) {
        List<String> images = entity.getImages().stream()
            .sorted(Comparator.comparingInt(MissingPersonImageEntity::getDisplayOrder))
            .map(MissingPersonImageEntity::getImageUrl)
            .collect(Collectors.toList());

        if (images.isEmpty()) {
            images.add("https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600");
        }

        return PublicCaseDto.builder()
            .id(entity.getId())
            .fullName(entity.getFullName())
            .nickName(entity.getNickName())
            .gender(entity.getGender())
            .age(entity.getAge())
            .height(entity.getHeight())
            .weight(entity.getWeight())
            .bloodGroup(entity.getBloodGroup())
            .skinTone(entity.getSkinTone())
            .hairColor(entity.getHairColor())
            .eyeColor(entity.getEyeColor())
            .identificationMarks(entity.getIdentificationMarks())
            .lastSeenDate(entity.getLastSeenDate())
            .lastSeenTime(entity.getLastSeenTime())
            .lastSeenLocation(entity.getLastSeenLocation())
            .state(entity.getState())
            .district(entity.getDistrict())
            .city(entity.getCity())
            .missingCircumstances(entity.getMissingCircumstances())
            .clothingDescription(entity.getClothingDescription())
            .policeStationId(entity.getPoliceStationId())
            .policeStationName(stationName)
            .caseNumber(entity.getCaseNumber())
            .status(entity.getStatus())
            .priority(entity.getPriority())
            .images(images)
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }

    public CaseDetailDto mapToDetailDto(MissingPersonEntity entity, String stationName) {
        List<String> images = entity.getImages().stream()
            .sorted(Comparator.comparingInt(MissingPersonImageEntity::getDisplayOrder))
            .map(MissingPersonImageEntity::getImageUrl)
            .collect(Collectors.toList());

        if (images.isEmpty()) {
            images.add("https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600");
        }

        List<String> volunteerIds = entity.getVolunteerAssignments().stream()
            .map(VolunteerCaseAssignmentEntity::getVolunteerId)
            .collect(Collectors.toList());

        return CaseDetailDto.builder()
            .id(entity.getId())
            .fullName(entity.getFullName())
            .nickName(entity.getNickName())
            .gender(entity.getGender())
            .dob(entity.getDob())
            .age(entity.getAge())
            .height(entity.getHeight())
            .weight(entity.getWeight())
            .bloodGroup(entity.getBloodGroup())
            .skinTone(entity.getSkinTone())
            .hairColor(entity.getHairColor())
            .eyeColor(entity.getEyeColor())
            .identificationMarks(entity.getIdentificationMarks())
            .medicalConditions(entity.getMedicalConditions())
            .mentalHealthCondition(entity.getMentalHealthCondition())
            .lastSeenDate(entity.getLastSeenDate())
            .lastSeenTime(entity.getLastSeenTime())
            .lastSeenLocation(entity.getLastSeenLocation())
            .state(entity.getState())
            .district(entity.getDistrict())
            .city(entity.getCity())
            .missingCircumstances(entity.getMissingCircumstances())
            .clothingDescription(entity.getClothingDescription())
            .guardianName(entity.getGuardianName())
            .guardianContact(entity.getGuardianContact())
            .policeStationId(entity.getPoliceStationId())
            .policeStationName(stationName)
            .firNumber(entity.getFirNumber())
            .caseNumber(entity.getCaseNumber())
            .status(entity.getStatus())
            .priority(entity.getPriority())
            .images(images)
            .assignedVolunteerIds(volunteerIds)
            .registeredByUserId(entity.getRegisteredByUserId())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}
