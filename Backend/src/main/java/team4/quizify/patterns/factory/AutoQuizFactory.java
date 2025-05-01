package team4.quizify.patterns.factory;

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
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Component
public class AutoQuizFactory implements QuizFactory {

    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private QuizManagementService quizManagementService;
    
    @Autowired
    private TeacherService teacherService;

    @Override
    public Quiz createQuiz(Map<String, Object> requestBody) {
        // Extract parameters from request body
        Integer count = (Integer) requestBody.get("count");
        Integer subjectId = (Integer) requestBody.get("subjectId");
        Integer teacherId = (Integer) requestBody.get("teacherId");
        Integer level = (Integer) requestBody.get("level");
        String title = (String) requestBody.get("title");
        String description = (String) requestBody.get("description");
        Integer timeLimit = (Integer) requestBody.get("timeLimit");
        
        // Set default level to 2 if not provided
        if (level == null) {
            level = 2; // Default to medium difficulty
        }
        
        // Validate parameters
        if (count == null || count <= 0 || subjectId == null) {
            throw new IllegalArgumentException("Invalid parameters provided");
        }
        
        // Get questions based on the specified level for the subject
        List<Question> questions = getQuestionsByLevel(subjectId, level);
        
        if (questions.isEmpty()) {
            throw new IllegalArgumentException("No questions available for this subject and level");
        }
        
        // Randomly select questions up to the requested count
        List<Integer> selectedQuestionIds = new ArrayList<>();
        int totalMarks = 0;
        
        if (questions.size() <= count) {
            // If we have fewer or equal questions than requested, use all of them
            for (Question question : questions) {
                selectedQuestionIds.add(question.getQuestionId());
                totalMarks += question.getMarks();
            }
        } else {
            // Randomly select 'count' number of questions
            Collections.shuffle(questions);
            
            for (int i = 0; i < count; i++) {
                Question question = questions.get(i);
                selectedQuestionIds.add(question.getQuestionId());
                totalMarks += question.getMarks();
            }
        }
        
        // Determine difficulty level string from integer
        String levelString;
        switch (level) {
            case 1: levelString = "Easy"; break;
            case 3: levelString = "Hard"; break;
            case 4: levelString = "Mixed"; break;
            default: levelString = "Medium";
        }
        
        // Create the quiz
        Quiz quiz = new Quiz();
        quiz.setSubjectId(subjectId);
        quiz.setMarks(totalMarks);
        quiz.setLevel(levelString);
        quiz.setTimelimit(timeLimit == null ? 30 : timeLimit);
        quiz.setType("Auto");
        quiz.setQuestionIds(selectedQuestionIds.toArray(new Integer[0]));
        quiz.setTitle(title == null ? "Auto-Generated Quiz" : title);
        quiz.setDescription(description == null ? "Automatically created quiz" : description);
        
        // Save the quiz
        Quiz savedQuiz = quizManagementService.saveQuiz(quiz);
        
        if (teacherId != null) {
            // Update teacher's created quizzes
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

    @Override
    public Quiz editQuiz(Integer quizId, Map<String, Object> requestBody) {
        // First get the existing quiz
        Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
        if (!quizOptional.isPresent()) {
            throw new IllegalArgumentException("Quiz not found");
        }
        
        Quiz existingQuiz = quizOptional.get();
        
        // Extract and update parameters
        String title = (String) requestBody.get("title");
        String description = (String) requestBody.get("description");
        Integer timeLimit = (Integer) requestBody.get("timeLimit");
        Integer level = (Integer) requestBody.get("level");
        Integer count = (Integer) requestBody.get("count");
        
        // Update quiz properties if provided
        if (title != null) existingQuiz.setTitle(title);
        if (description != null) existingQuiz.setDescription(description);
        if (timeLimit != null) existingQuiz.setTimelimit(timeLimit);
        
        // If level or count is provided, regenerate questions
        if ((level != null || count != null) && existingQuiz.getSubjectId() != null) {
            // Use existing level if not provided
            if (level == null) {
                switch (existingQuiz.getLevel()) {
                    case "Easy": level = 1; break;
                    case "Hard": level = 3; break;
                    case "Mixed": level = 4; break;
                    default: level = 2; // Medium
                }
            }
            
            // Use existing count if not provided
            if (count == null && existingQuiz.getQuestionIds() != null) {
                count = existingQuiz.getQuestionIds().length;
            } else if (count == null) {
                count = 10; // Default count
            }
            
            // Get questions for the subject and level
            List<Question> questions = getQuestionsByLevel(existingQuiz.getSubjectId(), level);
            
            if (!questions.isEmpty()) {
                // Randomly select questions up to the requested count
                List<Integer> selectedQuestionIds = new ArrayList<>();
                int totalMarks = 0;
                
                if (questions.size() <= count) {
                    // If we have fewer or equal questions than requested, use all of them
                    for (Question question : questions) {
                        selectedQuestionIds.add(question.getQuestionId());
                        totalMarks += question.getMarks();
                    }
                } else {
                    // Randomly select 'count' number of questions
                    Collections.shuffle(questions);
                    
                    for (int i = 0; i < count; i++) {
                        Question question = questions.get(i);
                        selectedQuestionIds.add(question.getQuestionId());
                        totalMarks += question.getMarks();
                    }
                }
                
                // Determine difficulty level string from integer
                String levelString;
                switch (level) {
                    case 1: levelString = "Easy"; break;
                    case 3: levelString = "Hard"; break;
                    case 4: levelString = "Mixed"; break;
                    default: levelString = "Medium";
                }
                
                // Update quiz with new questions, marks, and level
                existingQuiz.setQuestionIds(selectedQuestionIds.toArray(new Integer[0]));
                existingQuiz.setMarks(totalMarks);
                existingQuiz.setLevel(levelString);
            }
        }
        
        // Save and return the updated quiz
        return quizManagementService.saveQuiz(existingQuiz);
    }
    
  
    private List<Question> getQuestionsByLevel(Integer subjectId, Integer level) {
        List<Question> levelQuestions = new ArrayList<>();
        
        // For level 4, get a mix of easy, medium, and hard questions
        if (level == 4) {
            // Get questions of each difficulty level
            List<Question> easyQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 1);
            List<Question> mediumQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 2);
            List<Question> hardQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 3);
            
            // Add some questions from each level (with preference for medium)
            if (!easyQuestions.isEmpty()) levelQuestions.addAll(easyQuestions);
            if (!mediumQuestions.isEmpty()) levelQuestions.addAll(mediumQuestions);
            if (!hardQuestions.isEmpty()) levelQuestions.addAll(hardQuestions);
        } else {
            // Otherwise, get questions for the specific level
            levelQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, level);
        }
        
        return levelQuestions;
    }
}
