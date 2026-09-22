package gov.mpin.service;

import gov.mpin.dto.NotificationLogDtos.PageResponse;
import gov.mpin.dto.NotificationLogDtos.SystemLogDto;
import gov.mpin.entity.SystemLogEntity;
import gov.mpin.enums.LogLevel;
import gov.mpin.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    @Transactional
    public void log(String userId, String userName, String action, String entity, String entityId, LogLevel level) {
        SystemLogEntity log = SystemLogEntity.builder()
            .id("log-" + UUID.randomUUID().toString().substring(0, 8))
            .userId(userId)
            .userName(userName)
            .action(action)
            .entity(entity)
            .entityId(entityId)
            .level(level != null ? level : LogLevel.INFO)
            .createdAt(LocalDateTime.now())
            .build();
        systemLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<SystemLogDto> getAllLogs() {
        return systemLogRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<SystemLogDto> getPagedLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SystemLogEntity> pageResult = systemLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.<SystemLogDto>builder()
            .content(pageResult.getContent().stream().map(this::mapToDto).collect(Collectors.toList()))
            .totalElements(pageResult.getTotalElements())
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    public SystemLogDto mapToDto(SystemLogEntity entity) {
        return SystemLogDto.builder()
            .id(entity.getId())
            .userId(entity.getUserId())
            .userName(entity.getUserName())
            .action(entity.getAction())
            .entity(entity.getEntity())
            .entityId(entity.getEntityId())
            .level(entity.getLevel())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
