package gov.mpin.dto;

import gov.mpin.enums.CasePriority;
import gov.mpin.enums.CaseStatus;
import gov.mpin.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CaseDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateCaseRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;
        private String nickName;
        @NotNull(message = "Gender is required")
        private Gender gender;
        private LocalDate dob;
        @NotNull(message = "Age is required")
        private Integer age;
        private BigDecimal height;
        private BigDecimal weight;
        private String bloodGroup;
        private String skinTone;
        private String hairColor;
        private String eyeColor;
        private String identificationMarks;
        private String medicalConditions;
        private String mentalHealthCondition;

        @NotNull(message = "Last seen date is required")
        private LocalDate lastSeenDate;
        private String lastSeenTime;

        @NotBlank(message = "Last seen location is required")
        private String lastSeenLocation;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "District is required")
        private String district;
        private String city;

        private String missingCircumstances;
        private String clothingDescription;
        private String guardianName;
        private String guardianContact;

        @NotBlank(message = "Police station is required")
        private String policeStationId;
        private String firNumber;

        @Builder.Default
        private CasePriority priority = CasePriority.HIGH;

        @Builder.Default
        private List<String> images = new ArrayList<>();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateCaseRequest {
        private String fullName;
        private String nickName;
        private Gender gender;
        private LocalDate dob;
        private Integer age;
        private BigDecimal height;
        private BigDecimal weight;
        private String bloodGroup;
        private String skinTone;
        private String hairColor;
        private String eyeColor;
        private String identificationMarks;
        private String medicalConditions;
        private String mentalHealthCondition;
        private LocalDate lastSeenDate;
        private String lastSeenTime;
        private String lastSeenLocation;
        private String state;
        private String district;
        private String city;
        private String missingCircumstances;
        private String clothingDescription;
        private String guardianName;
        private String guardianContact;
        private String firNumber;
        private CasePriority priority;
        private List<String> images;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateCaseStatusRequest {
        @NotNull(message = "Status is required")
        private CaseStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssignVolunteerRequest {
        @NotBlank(message = "Volunteer ID is required")
        private String volunteerId;
    }

    // Full detail DTO (Police & Admin)
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CaseDetailDto {
        private String id;
        private String fullName;
        private String nickName;
        private Gender gender;
        private LocalDate dob;
        private Integer age;
        private BigDecimal height;
        private BigDecimal weight;
        private String bloodGroup;
        private String skinTone;
        private String hairColor;
        private String eyeColor;
        private String identificationMarks;
        private String medicalConditions;
        private String mentalHealthCondition;
        private LocalDate lastSeenDate;
        private String lastSeenTime;
        private String lastSeenLocation;
        private String state;
        private String district;
        private String city;
        private String missingCircumstances;
        private String clothingDescription;
        private String guardianName;
        private String guardianContact;
        private String policeStationId;
        private String policeStationName;
        private String firNumber;
        private String caseNumber;
        private CaseStatus status;
        private CasePriority priority;
        private List<String> images;
        private List<String> assignedVolunteerIds;
        private String registeredByUserId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    // Privacy-safe DTO (Public searches & public profile)
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PublicCaseDto {
        private String id;
        private String fullName;
        private String nickName;
        private Gender gender;
        private Integer age;
        private BigDecimal height;
        private BigDecimal weight;
        private String bloodGroup;
        private String skinTone;
        private String hairColor;
        private String eyeColor;
        private String identificationMarks;
        private LocalDate lastSeenDate;
        private String lastSeenTime;
        private String lastSeenLocation;
        private String state;
        private String district;
        private String city;
        private String missingCircumstances;
        private String clothingDescription;
        private String policeStationId;
        private String policeStationName;
        private String caseNumber;
        private CaseStatus status;
        private CasePriority priority;
        private List<String> images;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CaseSearchFilter {
        private String search;
        private String gender;
        private String state;
        private String district;
        private String city;
        private CaseStatus status;
        private Integer minAge;
        private Integer maxAge;
        private LocalDate from;
        private LocalDate to;
        private String stationId;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 12;
    }
}
