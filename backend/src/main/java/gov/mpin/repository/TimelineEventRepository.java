package gov.mpin.repository;

import gov.mpin.entity.TimelineEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineEventRepository extends JpaRepository<TimelineEventEntity, String> {
    List<TimelineEventEntity> findByPersonIdOrderByCreatedAtDesc(String personId);
}
