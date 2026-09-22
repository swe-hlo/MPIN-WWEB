package gov.mpin.repository;

import gov.mpin.entity.VolunteerCaseAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerCaseAssignmentRepository extends JpaRepository<VolunteerCaseAssignmentEntity, String> {
    List<VolunteerCaseAssignmentEntity> findByPersonId(String personId);
    List<VolunteerCaseAssignmentEntity> findByVolunteerId(String volunteerId);
    Optional<VolunteerCaseAssignmentEntity> findByPersonIdAndVolunteerId(String personId, String volunteerId);
    boolean existsByPersonIdAndVolunteerId(String personId, String volunteerId);
    void deleteByPersonIdAndVolunteerId(String personId, String volunteerId);
}
