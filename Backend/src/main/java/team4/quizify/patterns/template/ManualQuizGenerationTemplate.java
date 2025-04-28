package team4.quizify.patterns.template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Question;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.QuestionBank;
import team4.quizify.service.QuestionService;
import team4.quizify.service.QuizManagementService;
import team4.quizify.service.TeacherService;
import team4.quizify.service.QuestionBankService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;


@Component
public class ManualQuizGenerationTemplate extends QuizGenerationTemplate {

    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private QuizManagementService quizManagementService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private QuestionBankService questionBankService;

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
        
        // Get selected question IDs
        List<?> questionIdsList = (List<?>) quizParams.get("questionIds");
        Set<Integer> selectedQuestionIds = new HashSet<>();
        
        if (questionIdsList != null) {
            for (Object id : questionIdsList) {
                if (id instanceof Integer) {
                    selectedQuestionIds.add((Integer) id);
                } else if (id instanceof Number) {
                    selectedQuestionIds.add(((Number) id).intValue());
                } else if (id instanceof String) {
                    try {
                        selectedQuestionIds.add(Integer.parseInt((String) id));
                    } catch (NumberFormatException e) {
                        // Skip invalid IDs
                    }
                }
            }
        }
        
        // Get all available questions
        List<Integer> availableQuestionIds = new ArrayList<>();
        List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
        
        if (!questionBanks.isEmpty() && questionBanks.get(0).getQuestionIds() != null) {
            availableQuestionIds.addAll(Arrays.asList(questionBanks.get(0).getQuestionIds()));
        }
        
        // Validate selected question IDs
        Set<Integer> validSelectedQuestionIds = new HashSet<>();
        for (Integer qid : selectedQuestionIds) {
            if (availableQuestionIds.contains(qid)) {
                validSelectedQuestionIds.add(qid);
            }
        }
        
        // Fill remaining with random questions if needed
        List<Integer> finalQuestionIds = new ArrayList<>(validSelectedQuestionIds);
        availableQuestionIds.removeAll(validSelectedQuestionIds);
        
        int remainingQuestions = count - finalQuestionIds.size();
        if (remainingQuestions > 0 && !availableQuestionIds.isEmpty()) {
            Random random = new Random();
            List<Integer> availableList = new ArrayList<>(availableQuestionIds);
            
            while (finalQuestionIds.size() < count && !availableList.isEmpty()) {
                int randomIndex = random.nextInt(availableList.size());
                Integer randomQuestionId = availableList.get(randomIndex);
                finalQuestionIds.add(randomQuestionId);
                availableList.remove(randomIndex);
            }
        }
        
        // Fetch actual Question objects
        List<Question> selectedQuestions = new ArrayList<>();
        for (Integer qid : finalQuestionIds) {
            Optional<Question> questionOpt = questionService.getQuestionById(qid);
            questionOpt.ifPresent(selectedQuestions::add);
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
        String level = (String) quizParams.get("level");
        
        // Extract question IDs
        Integer[] questionIds = new Integer[selectedQuestions.size()];
        for (int i = 0; i < selectedQuestions.size(); i++) {
            questionIds[i] = selectedQuestions.get(i).getQuestionId();
        }
          // Create quiz with standardized level format
        Quiz quiz = new Quiz();
        quiz.setSubjectId(subjectId);
        quiz.setMarks((Integer) quizMetrics.get("totalMarks"));
        
        // Normalize level to numeric format (1-4)
        String normalizedLevel = "2"; // Default to medium/intermediate (2)
        if (level != null) {
            String levelLower = level.toLowerCase();
            if (levelLower.contains("easy") || levelLower.contains("beginner") || level.equals("1")) {
                normalizedLevel = "1";
            } else if (levelLower.contains("medium") || levelLower.contains("intermediate") || level.equals("2")) {
                normalizedLevel = "2";
            } else if (levelLower.contains("hard") || levelLower.contains("advance") || level.equals("3")) {
                normalizedLevel = "3";
            } else if (levelLower.contains("mix") || level.equals("4")) {
                normalizedLevel = "4";
            }
        }
        
        quiz.setLevel(normalizedLevel);
        quiz.setTimelimit(timeLimit == null ? 30 : timeLimit);
        quiz.setType("Manual"); // Always use "Manual" for manually created quizzes
        quiz.setQuestionIds(questionIds);
        quiz.setTitle(title == null ? "Custom Quiz" : title);
        quiz.setDescription(description == null ? "Manually created quiz" : description);
        
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
