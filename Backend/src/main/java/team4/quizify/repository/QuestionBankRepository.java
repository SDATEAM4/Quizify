package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import team4.quizify.entity.QuestionBank;

import java.util.List;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBank, Integer> {
    List<QuestionBank> findBySubjectId(Integer subjectId);
}
