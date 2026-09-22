package gov.mpin.repository;

import gov.mpin.entity.MissingPersonImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissingPersonImageRepository extends JpaRepository<MissingPersonImageEntity, String> {
    List<MissingPersonImageEntity> findByPersonIdOrderByDisplayOrderAsc(String personId);
    void deleteByPersonId(String personId);
}
