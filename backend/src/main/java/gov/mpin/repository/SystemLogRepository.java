package gov.mpin.repository;

import gov.mpin.entity.SystemLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLogEntity, String> {
    List<SystemLogEntity> findAllByOrderByCreatedAtDesc();
    Page<SystemLogEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
