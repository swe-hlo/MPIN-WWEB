package gov.mpin.repository;

import gov.mpin.entity.InvestigationNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationNoteRepository extends JpaRepository<InvestigationNoteEntity, String> {
    List<InvestigationNoteEntity> findByPersonIdOrderByCreatedAtDesc(String personId);
}
