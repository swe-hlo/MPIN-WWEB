package gov.mpin.repository;

import gov.mpin.entity.SightingReportEntity;
import gov.mpin.enums.SightingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SightingReportRepository extends JpaRepository<SightingReportEntity, String> {
    List<SightingReportEntity> findAllByOrderByCreatedAtDesc();
    Page<SightingReportEntity> findByStatus(SightingStatus status, Pageable pageable);
    List<SightingReportEntity> findByCaseIdOrderByCreatedAtDesc(String caseId);
    long countByStatus(SightingStatus status);
}
