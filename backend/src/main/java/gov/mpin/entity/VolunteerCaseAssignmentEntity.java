package gov.mpin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_case_assignments", uniqueConstraints = {
    @UniqueConstraint(name = "uk_person_volunteer", columnNames = {"person_id", "volunteer_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerCaseAssignmentEntity {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private MissingPersonEntity person;

    @Column(name = "volunteer_id", nullable = false, length = 50)
    private String volunteerId;

    @Column(name = "assigned_by_user_id", length = 50)
    private String assignedByUserId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
