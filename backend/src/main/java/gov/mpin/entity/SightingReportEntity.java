package gov.mpin.entity;

import gov.mpin.enums.SightingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sighting_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SightingReportEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "case_id", length = 50)
    private String caseId;

    @Column(name = "reporter_name", nullable = false, length = 150)
    private String reporterName;

    @Column(name = "contact_number", nullable = false, length = 50)
    private String contactNumber;

    @Column(name = "sighting_date", nullable = false)
    private LocalDate sightingDate;

    @Column(name = "sighting_time", length = 20)
    private String sightingTime;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "maps_link", columnDefinition = "TEXT")
    private String mapsLink;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SightingStatus status = SightingStatus.NEW;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SightingStatus.NEW;
        }
    }
}
