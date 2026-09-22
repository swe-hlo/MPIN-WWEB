package gov.mpin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class DepartmentStationDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateDepartmentRequest {
        @NotBlank(message = "Department name is required")
        private String name;

        @NotBlank(message = "State is required")
        private String state;

        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentDto {
        private String id;
        private String name;
        private String state;
        private String description;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateStationRequest {
        @NotBlank(message = "Station name is required")
        private String name;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "District is required")
        private String district;

        private String city;
        private String contact;
        private String officerInCharge;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PoliceStationDto {
        private String id;
        private String name;
        private String state;
        private String district;
        private String city;
        private String contact;
        private String officerInCharge;
        private LocalDateTime createdAt;
    }
}
