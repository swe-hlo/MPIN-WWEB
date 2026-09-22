package gov.mpin.entity;

import gov.mpin.enums.CasePriority;
import gov.mpin.enums.CaseStatus;
import gov.mpin.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "missing_persons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissingPersonEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "nick_name", length = 150)
    private String nickName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Gender gender;

    private LocalDate dob;

    @Column(nullable = false)
    private Integer age;

    @Column(precision = 6, scale = 2)
    private BigDecimal height;

    @Column(precision = 6, scale = 2)
    private BigDecimal weight;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "skin_tone", length = 50)
    private String skinTone;

    @Column(name = "hair_color", length = 50)
    private String hairColor;

    @Column(name = "eye_color", length = 50)
    private String eyeColor;

    @Column(name = "identification_marks", columnDefinition = "TEXT")
    private String identificationMarks;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(name = "mental_health_condition", columnDefinition = "TEXT")
    private String mentalHealthCondition;

    @Column(name = "last_seen_date", nullable = false)
    private LocalDate lastSeenDate;

    @Column(name = "last_seen_time", length = 20)
    private String lastSeenTime;

    @Column(name = "last_seen_location", nullable = false, length = 255)
    private String lastSeenLocation;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(length = 100)
    private String city;

    @Column(name = "missing_circumstances", columnDefinition = "TEXT")
    private String missingCircumstances;

    @Column(name = "clothing_description", columnDefinition = "TEXT")
    private String clothingDescription;

    @Column(name = "guardian_name", length = 150)
    private String guardianName;

    @Column(name = "guardian_contact", length = 50)
    private String guardianContact;

    @Column(name = "police_station_id", nullable = false, length = 50)
    private String policeStationId;

    @Column(name = "fir_number", length = 100)
    private String firNumber;

    @Column(name = "case_number", nullable = false, unique = true, length = 100)
    private String caseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CasePriority priority;

    @Column(name = "registered_by_user_id", length = 50)
    private String registeredByUserId;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<MissingPersonImageEntity> images = new ArrayList<>();

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<VolunteerCaseAssignmentEntity> volunteerAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<InvestigationNoteEntity> notes = new ArrayList<>();

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<TimelineEventEntity> timelineEvents = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = CaseStatus.MISSING;
        if (priority == null) priority = CasePriority.HIGH;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
