package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Question;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Student;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.service.QuizManagementService;
import team4.quizify.service.QuestionService;
import team4.quizify.service.SubjectService;
import team4.quizify.service.StudentService;
import team4.quizify.service.TeacherService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/Quizify/quizzes")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizManagementService quizManagementService;
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private SubjectService subjectService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private StudentService studentService;
        @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getQuizzesByTeacher(@PathVariable Integer teacherId) {        // Get teacher by ID
        try {
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            
            if (teacher == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Teacher not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        User user = teacher.getUser();
        
        // Get created quiz IDs from teacher
        Integer[] createdQuizIds = teacher.getCreatedQuiz();
        if (createdQuizIds == null || createdQuizIds.length == 0) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        
        // Prepare response
        List<Map<String, Object>> quizzesList = new ArrayList<>();
        
        // Get quiz details for each quiz ID
        for (Integer quizId : createdQuizIds) {
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            
            if (quizOptional.isPresent()) {
                Quiz quiz = quizOptional.get();
                
                // Get subject name
                Optional<Subject> subjectOptional = subjectService.getSubjectById(quiz.getSubjectId());
                String subjectName = subjectOptional.isPresent() ? subjectOptional.get().getName() : "Unknown Subject";
                
                // Create response object
                Map<String, Object> quizData = new HashMap<>();
                quizData.put("quiz_id", quiz.getQuizId());
                quizData.put("title", quiz.getTitle());
                quizData.put("description", quiz.getDescription());
                quizData.put("subject_id", quiz.getSubjectId());
                quizData.put("subject_name", subjectName);
                quizData.put("level", quiz.getLevel());
                quizData.put("marks", quiz.getMarks());
                quizData.put("timelimit", quiz.getTimelimit());
                quizData.put("type", quiz.getType());               
                quizData.put("user_id", user.getUserId());
                quizData.put("username", user.getUsername());
                quizData.put("teacher_id", teacherId);
                
                // Get questions for this quiz
                List<Map<String, Object>> questionsList = new ArrayList<>();
                
                if (quiz.getQuestionIds() != null) {
                    for (Integer questionId : quiz.getQuestionIds()) {
                        Optional<Question> questionOptional = questionService.getQuestionById(questionId);
                        
                        if (questionOptional.isPresent()) {
                            Question question = questionOptional.get();
                            Map<String, Object> questionData = formatQuestionData(question);
                            questionsList.add(questionData);
                        }
                    }
                }
                
                quizData.put("questions", questionsList);
                quizzesList.add(quizData);
            }
        }
          return ResponseEntity.ok(quizzesList);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
   
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Integer quizId) {
        try {
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            
            if (!quizOptional.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        
        Quiz quiz = quizOptional.get();
        
        // Get subject name
        Optional<Subject> subjectOptional = subjectService.getSubjectById(quiz.getSubjectId());
        String subjectName = subjectOptional.isPresent() ? subjectOptional.get().getName() : "Unknown Subject";
        
        // Create response object
        Map<String, Object> quizData = new HashMap<>();
        quizData.put("quiz_id", quiz.getQuizId());
        quizData.put("title", quiz.getTitle());
        quizData.put("description", quiz.getDescription());
        quizData.put("subject_id", quiz.getSubjectId());
        quizData.put("subject_name", subjectName);
        quizData.put("level", quiz.getLevel());
        quizData.put("marks", quiz.getMarks());
        quizData.put("timelimit", quiz.getTimelimit());
        quizData.put("type", quiz.getType());
        
        // Get questions for this quiz
        List<Map<String, Object>> questionsList = new ArrayList<>();
        
        if (quiz.getQuestionIds() != null) {
            for (Integer questionId : quiz.getQuestionIds()) {
                Optional<Question> questionOptional = questionService.getQuestionById(questionId);
                
                if (questionOptional.isPresent()) {
                    Question question = questionOptional.get();
                    Map<String, Object> questionData = formatQuestionData(question);
                    questionsList.add(questionData);
                }
            }
        }
          quizData.put("questions", questionsList);
        
        return ResponseEntity.ok(quizData);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
        @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getQuizzesWithQuestionsByStudent(@PathVariable Integer studentId) {
        try {
            // Check if student exists
            Student student = studentService.getStudentByStudentId(studentId);
            if (student == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Student not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        User user = student.getUser();
        
        // Get enrolled subject IDs
        Integer[] enrolledSubjectIds = student.getEnrolledSubjects();
        if (enrolledSubjectIds == null || enrolledSubjectIds.length == 0) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        
        // Get attempted quiz IDs
        List<Integer> attemptedQuizIds = Arrays.asList(student.getAttemptedQuiz() != null ? 
                student.getAttemptedQuiz() : new Integer[0]);
        
        // Prepare response
        List<Map<String, Object>> quizzesList = new ArrayList<>();
        
        // Get quizzes for each enrolled subject
        for (Integer subjectId : enrolledSubjectIds) {
            List<Quiz> subjectQuizzes = quizManagementService.getQuizzesBySubject(subjectId);
            
            if (subjectQuizzes.isEmpty()) {
                continue;
            }
            
            // Get subject name
            Optional<Subject> subjectOptional = subjectService.getSubjectById(subjectId);
            String subjectName = subjectOptional.isPresent() ? subjectOptional.get().getName() : "Unknown Subject";
            
            // Process each quiz for this subject
            for (Quiz quiz : subjectQuizzes) {
                Map<String, Object> quizData = new HashMap<>();
                quizData.put("quiz_id", quiz.getQuizId());
                quizData.put("title", quiz.getTitle());
                quizData.put("description", quiz.getDescription());
                quizData.put("subject_id", quiz.getSubjectId());
                quizData.put("subject_name", subjectName);
                quizData.put("level", quiz.getLevel());
                quizData.put("marks", quiz.getMarks());
                quizData.put("timelimit", quiz.getTimelimit());
                quizData.put("type", quiz.getType());
                quizData.put("user_id", user.getUserId());
                quizData.put("username", user.getUsername());
                quizData.put("student_id", studentId);
                
                // Check if quiz has been attempted
                boolean attempted = attemptedQuizIds.contains(quiz.getQuizId());
                quizData.put("attemptedQuiz", attempted);
                
                // Get questions for this quiz
                List<Map<String, Object>> questionsList = new ArrayList<>();
                
                if (quiz.getQuestionIds() != null) {
                    for (Integer questionId : quiz.getQuestionIds()) {
                        Optional<Question> questionOptional = questionService.getQuestionById(questionId);
                        
                        if (questionOptional.isPresent()) {
                            Question question = questionOptional.get();
                            Map<String, Object> questionData = formatQuestionData(question);
                            questionsList.add(questionData);
                        }
                    }
                }
                
                quizData.put("questions", questionsList);
                quizzesList.add(quizData);
            }
        }
          return ResponseEntity.ok(quizzesList);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    //HELPER METHOD TO FORMAT QUESTION DATA
    private Map<String, Object> formatQuestionData(Question question) {
        Map<String, Object> questionData = new HashMap<>();
        questionData.put("question_id", question.getQuestionId());
        questionData.put("statement", question.getStatement());
        
        // Transform options into required format with a,b,c,d keys
        String[] optionsArray = question.getOptions();
        Map<String, String> optionsMap = new HashMap<>();
        if (optionsArray != null && optionsArray.length == 4) {
            optionsMap.put("a", optionsArray[0]);
            optionsMap.put("b", optionsArray[1]);
            optionsMap.put("c", optionsArray[2]);
            optionsMap.put("d", optionsArray[3]);
        }
        questionData.put("options", optionsMap);
          // Find the correct option key (a,b,c,d) instead of the value
        String correctOptionValue = question.getCorrectOption();
        String correctOptionKey = "a";  // default
        if (correctOptionValue != null && optionsArray != null) {
            for (int i = 0; i < optionsArray.length; i++) {
                if (correctOptionValue.equals(optionsArray[i])) {
                    correctOptionKey = (i == 0) ? "a" : (i == 1) ? "b" : (i == 2) ? "c" : "d";
                    break;
                }
            }
        }
        questionData.put("correct_answer", correctOptionKey);
        
        questionData.put("marks", question.getMarks());
        questionData.put("level", question.getLevel());
        
        return questionData;
    }
}
