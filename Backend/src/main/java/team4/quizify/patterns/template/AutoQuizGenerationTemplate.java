package team4.quizify.patterns.template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Question;
import team4.quizify.entity.Teacher;
import team4.quizify.service.QuestionService;
import team4.quizify.service.QuizManagementService;
import team4.quizify.service.TeacherService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AutoQuizGenerationTemplate extends QuizGenerationTemplate {

    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private QuizManagementService quizManagementService;
    
    @Autowired
    private TeacherService teacherService;

    @Override
    protected void validateQuizParameters(Map<String, Object> quizParams) {
        Integer count = (Integer) quizParams.get("count");
        Integer subjectId = (Integer) quizParams.get("subjectId");
        
        if (count == null || count <= 0 || subjectId == null) {
            throw new IllegalArgumentException("Invalid quiz parameters provided");
        }
    }

    @Override
    protected List<Question> selectQuestions(Map<String, Object> quizParams) {
        Integer count = (Integer) quizParams.get("count");
        Integer subjectId = (Integer) quizParams.get("subjectId");
        Integer level = (Integer) quizParams.get("level");
        
        // Set default level to medium if not provided
        if (level == null) {
            level = 2; // Medium difficulty
        }
        
        // Get questions based on level
        List<Question> questions = new ArrayList<>();
        
        // For level 4, get a mix of easy, medium, and hard questions
        if (level == 4) {
            List<Question> easyQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 1);
            List<Question> mediumQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 2);
            List<Question> hardQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 3);
            
            questions.addAll(easyQuestions);
            questions.addAll(mediumQuestions);
            questions.addAll(hardQuestions);
        } else {
            questions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, level);
        }
        
        // If no questions found, return empty list
        if (questions.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Randomly select questions up to the requested count
        List<Question> selectedQuestions = new ArrayList<>();
        
        if (questions.size() <= count) {
            selectedQuestions.addAll(questions);
        } else {
            Collections.shuffle(questions);
            selectedQuestions = questions.subList(0, count);
        }
        
        return selectedQuestions;
    }

    @Override
    protected Map<String, Object> calculateQuizMetrics(List<Question> selectedQuestions) {
        Map<String, Object> metrics = new HashMap<>();
        
        int totalMarks = 0;
        for (Question question : selectedQuestions) {
            totalMarks += question.getMarks();
        }
        
        metrics.put("totalMarks", totalMarks);
        metrics.put("questionCount", selectedQuestions.size());
        
        return metrics;
    }

    @Override
    protected Quiz createQuiz(Map<String, Object> quizParams, List<Question> selectedQuestions, 
                            Map<String, Object> quizMetrics) {
        
        Integer subjectId = (Integer) quizParams.get("subjectId");
        String title = (String) quizParams.get("title");
        String description = (String) quizParams.get("description");
        Integer timeLimit = (Integer) quizParams.get("timeLimit");
        Integer level = (Integer) quizParams.get("level");
          // Ensure level is between 1-4
        if (level == null) level = 2;
        if (level < 1 || level > 4) level = 2; // Default to medium if invalid
        
        // Extract question IDs
        Integer[] questionIds = new Integer[selectedQuestions.size()];
        for (int i = 0; i < selectedQuestions.size(); i++) {
            questionIds[i] = selectedQuestions.get(i).getQuestionId();
        }
        
        // Create quiz with numeric level (1=Easy/Beginner, 2=Medium/Intermediate, 3=Hard/Advanced, 4=Mixed)
        Quiz quiz = new Quiz();
        quiz.setSubjectId(subjectId);
        quiz.setMarks((Integer) quizMetrics.get("totalMarks"));
        quiz.setLevel(String.valueOf(level)); // Store level as string representation of number
        quiz.setTimelimit(timeLimit == null ? 30 : timeLimit);
        quiz.setType("Automatic"); // Always use "Automatic" for auto-generated quizzes
        quiz.setQuestionIds(questionIds);
        quiz.setTitle(title == null ? "Auto-Generated Quiz" : title);
        quiz.setDescription(description == null ? "Automatically created quiz" : description);
        
        // Save quiz
        Quiz savedQuiz = quizManagementService.saveQuiz(quiz);
        
        // Associate with teacher if provided
        Integer teacherId = (Integer) quizParams.get("teacherId");
        if (teacherId != null) {
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher != null) {
                Integer[] currentCreatedQuizzes = teacher.getCreatedQuiz();
                Integer[] updatedCreatedQuizzes;
                
                if (currentCreatedQuizzes == null || currentCreatedQuizzes.length == 0) {
                    updatedCreatedQuizzes = new Integer[]{savedQuiz.getQuizId()};
                } else {
                    updatedCreatedQuizzes = Arrays.copyOf(currentCreatedQuizzes, currentCreatedQuizzes.length + 1);
                    updatedCreatedQuizzes[currentCreatedQuizzes.length] = savedQuiz.getQuizId();
                }
                
                teacher.setCreatedQuiz(updatedCreatedQuizzes);
                teacherService.updateTeacher(teacher);
            }
        }
        
        return savedQuiz;
    }
}
