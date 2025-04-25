package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.Quiz;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    // Find quizzes by subject ID
    List<Quiz> findBySubjectId(Integer subjectId);
}
