package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
}
