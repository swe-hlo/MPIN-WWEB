package gov.mpin.dto;

import gov.mpin.enums.SightingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SightingDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateSightingRequest {
        private String caseId;

        @NotBlank(message = "Reporter name is required")
        private String reporterName;

        @NotBlank(message = "Contact number is required")
        private String contactNumber;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String time;

        @NotBlank(message = "Location is required")
        private String location;

        private String mapsLink;
        private String description;
        private String imageUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateSightingStatusRequest {
        @NotNull(message = "Status is required")
        private SightingStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SightingReportDto {
        private String id;
        private String caseId;
        private String reporterName;
        private String contactNumber;
        private LocalDate date;
        private String time;
        private String location;
        private String mapsLink;
        private String description;
        private String imageUrl;
        private SightingStatus status;
        private LocalDateTime createdAt;
    }
}
