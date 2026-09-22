package gov.mpin.service;

import gov.mpin.dto.DepartmentStationDtos.CreateDepartmentRequest;
import gov.mpin.dto.DepartmentStationDtos.DepartmentDto;
import gov.mpin.entity.DepartmentEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.DepartmentRepository;
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
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public List<DepartmentDto> listDepartments() {
        return departmentRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentDto createDepartment(CreateDepartmentRequest request, UserPrincipal actor) {
        String id = "d-" + UUID.randomUUID().toString().substring(0, 8);
        DepartmentEntity entity = DepartmentEntity.builder()
            .id(id)
            .name(request.getName().trim())
            .state(request.getState().trim())
            .description(request.getDescription())
            .createdAt(LocalDateTime.now())
            .build();

        departmentRepository.save(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "CREATE_DEPARTMENT",
            "Department",
            id,
            LogLevel.INFO
        );

        return mapToDto(entity);
    }

    @Transactional
    public void deleteDepartment(String id, UserPrincipal actor) {
        DepartmentEntity entity = departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        departmentRepository.delete(entity);

        systemLogService.log(
            actor != null ? actor.getId() : null,
            actor != null ? actor.getFullName() : "System",
            "DELETE_DEPARTMENT",
            "Department",
            id,
            LogLevel.WARN
        );
    }

    public DepartmentDto mapToDto(DepartmentEntity entity) {
        return DepartmentDto.builder()
            .id(entity.getId())
            .name(entity.getName())
            .state(entity.getState())
            .description(entity.getDescription())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
