package gov.mpin.service;

import gov.mpin.dto.DepartmentStationDtos.CreateStationRequest;
import gov.mpin.dto.DepartmentStationDtos.PoliceStationDto;
import gov.mpin.entity.PoliceStationEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.PoliceStationRepository;
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
public class PoliceStationService {

    private final PoliceStationRepository policeStationRepository;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public List<PoliceStationDto> listStations() {
        return policeStationRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PoliceStationDto getStation(String id) {
        PoliceStationEntity entity = policeStationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Police Station not found"));
        return mapToDto(entity);
    }

    @Transactional
    public PoliceStationDto createStation(CreateStationRequest request, UserPrincipal actor) {
        String id = "ps-" + UUID.randomUUID().toString().substring(0, 8);
        PoliceStationEntity entity = PoliceStationEntity.builder()
            .id(id)
            .name(request.getName().trim())
            .state(request.getState().trim())
            .district(request.getDistrict().trim())
            .city(request.getCity())
            .contact(request.getContact())
            .officerInCharge(request.getOfficerInCharge())
            .createdAt(LocalDateTime.now())
            .build();

        policeStationRepository.save(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "CREATE_POLICE_STATION",
            "PoliceStation",
            id,
            LogLevel.INFO
        );

        return mapToDto(entity);
    }

    @Transactional
    public void deleteStation(String id, UserPrincipal actor) {
        PoliceStationEntity entity = policeStationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Police Station not found"));

        policeStationRepository.delete(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "DELETE_POLICE_STATION",
            "PoliceStation",
            id,
            LogLevel.WARN
        );
    }

    public PoliceStationDto mapToDto(PoliceStationEntity entity) {
        return PoliceStationDto.builder()
            .id(entity.getId())
            .name(entity.getName())
            .state(entity.getState())
            .district(entity.getDistrict())
            .city(entity.getCity())
            .contact(entity.getContact())
            .officerInCharge(entity.getOfficerInCharge())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
