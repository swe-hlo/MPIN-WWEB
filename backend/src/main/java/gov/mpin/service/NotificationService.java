package gov.mpin.service;

import gov.mpin.dto.NotificationLogDtos.NotificationDto;
import gov.mpin.entity.NotificationEntity;
import gov.mpin.enums.NotificationType;
import gov.mpin.exception.ResourceNotFoundException;
import gov.mpin.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(String userId, NotificationType type, String title, String message, String caseId) {
        NotificationEntity notification = NotificationEntity.builder()
            .id("n-" + UUID.randomUUID().toString().substring(0, 8))
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .caseId(caseId)
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(String id) {
        NotificationEntity notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return mapToDto(notification);
    }

    public NotificationDto mapToDto(NotificationEntity entity) {
        return NotificationDto.builder()
            .id(entity.getId())
            .userId(entity.getUserId())
            .type(entity.getType())
            .title(entity.getTitle())
            .message(entity.getMessage())
            .caseId(entity.getCaseId())
            .read(entity.isRead())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
