package gov.mpin.dto;

import gov.mpin.enums.TimelineEventType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class InvestigationDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddNoteRequest {
        @NotBlank(message = "Note content is required")
        private String note;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvestigationNoteDto {
        private String id;
        private String caseId;
        private String authorId;
        private String authorName;
        private String note;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimelineEventDto {
        private String id;
        private String caseId;
        private TimelineEventType type;
        private String message;
        private LocalDateTime createdAt;
    }
}
