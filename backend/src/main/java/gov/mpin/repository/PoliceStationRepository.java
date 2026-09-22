package gov.mpin.repository;

import gov.mpin.entity.PoliceStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStationEntity, String> {
    List<PoliceStationEntity> findAllByOrderByCreatedAtDesc();
    List<PoliceStationEntity> findByState(String state);
}
