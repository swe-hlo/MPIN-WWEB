package gov.mpin.repository;

import gov.mpin.entity.MissingPersonEntity;
import gov.mpin.enums.CaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MissingPersonRepository extends JpaRepository<MissingPersonEntity, String>, JpaSpecificationExecutor<MissingPersonEntity> {

    Optional<MissingPersonEntity> findByCaseNumber(String caseNumber);

    Page<MissingPersonEntity> findByPoliceStationId(String policeStationId, Pageable pageable);

    long countByStatus(CaseStatus status);

    long countByStatusIn(List<CaseStatus> statuses);

    @Query("SELECT m.state, COUNT(m) FROM MissingPersonEntity m GROUP BY m.state")
    List<Object[]> countByStateGrouped();

    @Query("SELECT m.gender, COUNT(m) FROM MissingPersonEntity m GROUP BY m.gender")
    List<Object[]> countByGenderGrouped();

    @Query("SELECT m FROM MissingPersonEntity m JOIN m.volunteerAssignments v WHERE v.volunteerId = :volunteerId ORDER BY m.createdAt DESC")
    List<MissingPersonEntity> findAssignedToVolunteer(String volunteerId);
}
