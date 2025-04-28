package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Question;
import team4.quizify.entity.Teacher;
import team4.quizify.service.QuestionService;
import team4.quizify.service.QuizManagementService;
import team4.quizify.service.TeacherService;
import team4.quizify.service.QuestionBankService;
import team4.quizify.entity.QuestionBank;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;


@Component
public class ManualQuizFactory implements QuizFactory {

    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private QuizManagementService quizManagementService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private QuestionBankService questionBankService;

    @Override
    public Quiz createQuiz(Map<String, Object> requestBody) {
        // Extract parameters from request body
        Integer count = (Integer) requestBody.get("count");
        Integer subjectId = (Integer) requestBody.get("subjectId");
        Integer teacherId = (Integer) requestBody.get("teacherId");
        String title = (String) requestBody.get("title");
        String description = (String) requestBody.get("description");
        Integer timeLimit = (Integer) requestBody.get("timeLimit");
        String level = (String) requestBody.get("level");
        
        // Extract question IDs from request
        List<?> questionIdsList = (List<?>) requestBody.get("questionIds");
        Set<Integer> selectedQuestionIds = new HashSet<>();
        
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
        
        // Validate parameters
        if (count == null || count <= 0 || subjectId == null) {
            throw new IllegalArgumentException("Invalid parameters provided");
        }
        
        // Get all available questions for the subject from question bank
        List<Integer> availableQuestionIds = new ArrayList<>();
        List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
        
        if (questionBanks.isEmpty() || questionBanks.get(0).getQuestionIds() == null) {
            throw new IllegalArgumentException("No questions available for this subject");
        }
        
        // Get questions from question bank
        Integer[] bankQuestionIds = questionBanks.get(0).getQuestionIds();
        for (Integer id : bankQuestionIds) {
            availableQuestionIds.add(id);
        }
        
        // Validate that selected questions exist in the subject's questions
        Set<Integer> validSelectedQuestionIds = new HashSet<>();
        for (Integer qid : selectedQuestionIds) {
            if (availableQuestionIds.contains(qid)) {
                validSelectedQuestionIds.add(qid);
            }
        }
        
        // Create a list to store the final question IDs for the quiz
        List<Integer> finalQuestionIds = new ArrayList<>(validSelectedQuestionIds);
        
        // Remove already selected questions from available questions to avoid duplicates
        availableQuestionIds.removeAll(validSelectedQuestionIds);
        
        // Check if we have enough questions to fulfill the requested count
        int remainingQuestions = count - finalQuestionIds.size();
        
        if (remainingQuestions > 0) {
            // If we need more questions and have enough available
            if (availableQuestionIds.size() >= remainingQuestions) {
                // Randomly select additional questions
                Random random = new Random();
                List<Integer> availableList = new ArrayList<>(availableQuestionIds);
                
                while (finalQuestionIds.size() < count && !availableList.isEmpty()) {
                    int randomIndex = random.nextInt(availableList.size());
                    Integer randomQuestionId = availableList.get(randomIndex);
                    finalQuestionIds.add(randomQuestionId);
                    availableList.remove(randomIndex);
                }
            } else {
                // If we don't have enough questions, use all available
                finalQuestionIds.addAll(availableQuestionIds);
            }
        }
        
        // Check if we have any questions after all our processing
        if (finalQuestionIds.isEmpty()) {
            throw new IllegalArgumentException("Cannot create a quiz with zero questions");
        }
        
        // Calculate total marks based on questions
        int totalMarks = 0;
        for (Integer qid : finalQuestionIds) {
            Optional<Question> question = questionService.getQuestionById(qid);
            if (question.isPresent()) {
                totalMarks += question.get().getMarks();
            }
        }
        
        // Create the quiz
        Quiz quiz = new Quiz();
        quiz.setSubjectId(subjectId);
        quiz.setMarks(totalMarks);
        quiz.setLevel(level == null ? "Medium" : level);
        quiz.setTimelimit(timeLimit == null ? 30 : timeLimit);
        quiz.setType("Manual");
        quiz.setQuestionIds(finalQuestionIds.toArray(new Integer[0]));
        quiz.setTitle(title == null ? "Custom Quiz" : title);
        quiz.setDescription(description == null ? "Manually created quiz" : description);
        
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
        String level = (String) requestBody.get("level");
        
        // Update quiz properties if provided
        if (title != null) existingQuiz.setTitle(title);
        if (description != null) existingQuiz.setDescription(description);
        if (timeLimit != null) existingQuiz.setTimelimit(timeLimit);
        if (level != null) existingQuiz.setLevel(level);
        
        // Handle question IDs if provided
        List<?> questionIdsList = (List<?>) requestBody.get("questionIds");
        if (questionIdsList != null && !questionIdsList.isEmpty()) {
            Set<Integer> selectedQuestionIds = new HashSet<>();
            
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
            
            // Validate that selected questions exist for the subject
            Integer subjectId = existingQuiz.getSubjectId();
            List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
            
            if (!questionBanks.isEmpty() && questionBanks.get(0).getQuestionIds() != null) {
                List<Integer> availableQuestionIds = Arrays.asList(questionBanks.get(0).getQuestionIds());
                
                // Filter valid question IDs
                Set<Integer> validSelectedQuestionIds = new HashSet<>();
                for (Integer qid : selectedQuestionIds) {
                    if (availableQuestionIds.contains(qid)) {
                        validSelectedQuestionIds.add(qid);
                    }
                }
                
                if (!validSelectedQuestionIds.isEmpty()) {
                    // Calculate total marks based on questions
                    int totalMarks = 0;
                    for (Integer qid : validSelectedQuestionIds) {
                        Optional<Question> question = questionService.getQuestionById(qid);
                        if (question.isPresent()) {
                            totalMarks += question.get().getMarks();
                        }
                    }
                    
                    // Update quiz with new question IDs and marks
                    existingQuiz.setQuestionIds(validSelectedQuestionIds.toArray(new Integer[0]));
                    existingQuiz.setMarks(totalMarks);
                }
            }
        }
        
        // Save and return the updated quiz
        return quizManagementService.saveQuiz(existingQuiz);
    }
}
