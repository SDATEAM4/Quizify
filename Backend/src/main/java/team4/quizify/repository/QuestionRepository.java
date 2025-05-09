package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findBySubjectId(Integer subjectId);
    List<Question> findByLevel(Integer level);
    List<Question> findBySubjectIdAndLevel(Integer subjectId, Integer level);
}
