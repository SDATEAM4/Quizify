package team4.quizify.patterns.template;

import java.util.List;
import java.util.Map;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Question;

public abstract class QuizGenerationTemplate {
    
  
    public final Quiz generateQuiz(Map<String, Object> quizParams) {
        // Step 1: Validate quiz parameters
        validateQuizParameters(quizParams);
        
        // Step 2: Select questions
        List<Question> selectedQuestions = selectQuestions(quizParams);
        
        // Step 3: Calculate quiz metrics (marks, difficulty level, etc.)
        Map<String, Object> quizMetrics = calculateQuizMetrics(selectedQuestions);
        
        // Step 4: Create and return the quiz
        return createQuiz(quizParams, selectedQuestions, quizMetrics);
    }
    
    // Abstract methods to be implemented by concrete classes
    protected abstract void validateQuizParameters(Map<String, Object> quizParams);
    protected abstract List<Question> selectQuestions(Map<String, Object> quizParams);
    protected abstract Map<String, Object> calculateQuizMetrics(List<Question> selectedQuestions);
    protected abstract Quiz createQuiz(Map<String, Object> quizParams, List<Question> selectedQuestions, 
                                     Map<String, Object> quizMetrics);
}
