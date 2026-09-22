package gov.mpin.repository;

import gov.mpin.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, String> {
    List<DepartmentEntity> findAllByOrderByCreatedAtDesc();
}
