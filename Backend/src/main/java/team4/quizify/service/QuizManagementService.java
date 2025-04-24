package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Quiz;
import team4.quizify.repository.QuizRepository;

import java.util.List;
import java.util.Optional;

@Service
public class QuizManagementService {

    @Autowired
    private QuizRepository quizRepository;

   
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    
    public Optional<Quiz> getQuizById(Integer quizId) {
        return quizRepository.findById(quizId);
    }

   
    public List<Quiz> getQuizzesBySubject(Integer subjectId) {
        return quizRepository.findBySubjectId(subjectId);
    }


    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

   
    public void deleteQuiz(Integer quizId) {
        quizRepository.deleteById(quizId);
    }
}
