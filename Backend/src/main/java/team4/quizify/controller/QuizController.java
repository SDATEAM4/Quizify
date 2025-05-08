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
import team4.quizify.entity.QuestionBank;
import team4.quizify.patterns.template.AutoQuizGenerationTemplate;
import team4.quizify.patterns.template.ManualQuizGenerationTemplate;
import team4.quizify.service.QuizManagementService;
import team4.quizify.service.QuestionService;
import team4.quizify.service.SubjectService;
import team4.quizify.service.StudentService;
import team4.quizify.service.TeacherService;
import team4.quizify.service.QuestionBankService;
import team4.quizify.service.ReportService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/Quizify/quizzes")
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
    
    @Autowired
    private QuestionBankService questionBankService;
    
    @Autowired
    private ManualQuizGenerationTemplate manualQuizGenerationTemplate;
    
    @Autowired
    private AutoQuizGenerationTemplate autoQuizGenerationTemplate;
    
    
    @Autowired
    private ReportService reportService;
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getQuizzesByTeacher(@PathVariable Integer teacherId) {        
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
            return handleInternalServerError(e, "fetching quizzes by teacher");
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
            return handleInternalServerError(e, "fetching quiz by ID");
        }
    }
    
   
    
    @PostMapping("/create/manual")
    public ResponseEntity<?> createManualQuiz(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract basic information for validation
            Integer count = (Integer) requestBody.get("count");
            Integer subjectId = (Integer) requestBody.get("subjectId");
            Integer teacherId = (Integer) requestBody.get("teacherId");
            
            // Basic validation
            if (count == null || count <= 0 || subjectId == null || teacherId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid parameters provided");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Check if teacher exists
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Teacher not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            // Process level parameter to ensure it's in the correct format (1-4)
            Object levelObj = requestBody.get("level");
            String levelParam = "2"; // Default to medium/intermediate
            
            if (levelObj != null) {
                if (levelObj instanceof Integer) {
                    int levelInt = (Integer) levelObj;
                    if (levelInt >= 1 && levelInt <= 4) {
                        levelParam = String.valueOf(levelInt);
                    }
                } else if (levelObj instanceof String) {
                    String levelStr = (String) levelObj;
                    if (levelStr.equalsIgnoreCase("easy") || levelStr.equalsIgnoreCase("beginner") || levelStr.equals("1")) {
                        levelParam = "1";
                    } else if (levelStr.equalsIgnoreCase("medium") || levelStr.equalsIgnoreCase("intermediate") || levelStr.equals("2")) {
                        levelParam = "2";
                    } else if (levelStr.equalsIgnoreCase("hard") || levelStr.equalsIgnoreCase("advance") || levelStr.equals("3")) {
                        levelParam = "3";
                    } else if (levelStr.equalsIgnoreCase("mixed") || levelStr.equals("4")) {
                        levelParam = "4";
                    }
                }
            }
            
            // Update level in the request body and ensure type is Manual
            requestBody.put("level", levelParam);
            requestBody.put("type", "Manual");
            
            // Use Template Method pattern
            Quiz quiz;
            try {
                quiz = manualQuizGenerationTemplate.generateQuiz(requestBody);
            } catch (IllegalArgumentException e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", e.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Prepare success response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("quiz_id", quiz.getQuizId());
            responseBody.put("message", "Quiz created successfully");
            
            if (quiz.getQuestionIds() != null && quiz.getQuestionIds().length < count) {
                responseBody.put("warning", "Not enough questions available. Created quiz with " + 
                                quiz.getQuestionIds().length + " questions instead of " + count);
            }
            
            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "creating manual quiz");
        }
    }
    
     
    @PostMapping("/create/auto")
    public ResponseEntity<?> createAutomaticQuiz(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract basic information for validation
            Integer count = (Integer) requestBody.get("count");
            Integer subjectId = (Integer) requestBody.get("subjectId");
            Integer teacherId = (Integer) requestBody.get("teacherId");
            
            // Basic validation
            if (count == null || count <= 0 || subjectId == null || teacherId == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid parameters provided");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Check if teacher exists
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Teacher not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
            if (questionBanks.isEmpty() || questionBanks.get(0).getQuestionIds() == null || 
                    questionBanks.get(0).getQuestionIds().length == 0) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "No questions available for this subject");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Handle level normalization
            Object levelObj = requestBody.get("level");
            Integer level = null;
            
            if (levelObj != null) {
                if (levelObj instanceof Integer) {
                    level = (Integer) levelObj;
                } else if (levelObj instanceof String) {
                    String levelStr = (String) levelObj;
                    // Convert string level to numeric format
                    if (levelStr.equalsIgnoreCase("easy") || levelStr.equalsIgnoreCase("beginner") || levelStr.equals("1")) {
                        level = 1;
                    } else if (levelStr.equalsIgnoreCase("medium") || levelStr.equalsIgnoreCase("intermediate") || levelStr.equals("2")) {
                        level = 2;
                    } else if (levelStr.equalsIgnoreCase("hard") || levelStr.equalsIgnoreCase("advance") || levelStr.equals("3")) {
                        level = 3;
                    } else if (levelStr.equalsIgnoreCase("mixed") || levelStr.equals("4")) {
                        level = 4;
                    }
                }
            }
            
            if (level == null || level < 1 || level > 4) {
                level = 2; // Default to medium if level is invalid or not provided
            }
            
            // Update level in the request body
            requestBody.put("level", level);
            requestBody.put("type", "Automatic"); // Ensure consistent type
            
            // Use Template Method pattern
            Quiz quiz;
            try {
                quiz = autoQuizGenerationTemplate.generateQuiz(requestBody);
               
                if (quiz.getQuestionIds() == null || quiz.getQuestionIds().length == 0) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Could not create quiz: no questions available for the selected level");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST); }
            } catch (IllegalArgumentException e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", e.getMessage());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Prepare success response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("quiz_id", quiz.getQuizId());
            responseBody.put("message", "Quiz created successfully");
            responseBody.put("question_count", quiz.getQuestionIds() != null ? quiz.getQuestionIds().length : 0);
            
            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "creating automatic quiz");
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
                    
                    // Add question count instead of detailed question information
                    int questionCount = quiz.getQuestionIds() != null ? quiz.getQuestionIds().length : 0;
                    quizData.put("questions", questionCount);
                    
                    // Only add quizzes that have not been attempted
                    if (!attempted) {
                        quizzesList.add(quizData);
                    }
                }
            }
            
            return ResponseEntity.ok(quizzesList);
        } catch (Exception e) {
            return handleInternalServerError(e, "fetching quizzes with questions by student");
        }
    }
    
    @PostMapping("/{quizId}/remove-questions")
    public ResponseEntity<?> removeQuestionsFromQuiz(
            @PathVariable Integer quizId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Extract new question IDs from request
            List<?> newQuestionIdsList = (List<?>) requestBody.get("questionIds");
            
            if (newQuestionIdsList == null || newQuestionIdsList.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "No question IDs provided");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Find the quiz
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            if (!quizOptional.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            Quiz quiz = quizOptional.get();
            Integer[] currentQuestionIds = quiz.getQuestionIds();
            
            // Convert new question IDs to a list of Integers
            List<Integer> updatedQuestionIds = new ArrayList<>();
            for (Object id : newQuestionIdsList) {
                if (id instanceof Integer) {
                    updatedQuestionIds.add((Integer) id);
                } else if (id instanceof Number) {
                    updatedQuestionIds.add(((Number) id).intValue());
                } else if (id instanceof String) {
                    try {
                        updatedQuestionIds.add(Integer.parseInt((String) id));
                    } catch (NumberFormatException e) {
                        // Skip invalid IDs
                    }
                }
            }
            
            // If after parsing, no valid IDs are found
            if (updatedQuestionIds.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "No valid question IDs provided");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Calculate updated total marks based on new questions
            int totalMarks = 0;
            List<Integer> validQuestionIds = new ArrayList<>();
            for (Integer qid : updatedQuestionIds) {
                Optional<Question> question = questionService.getQuestionById(qid);
                if (question.isPresent()) {
                    totalMarks += question.get().getMarks();
                    validQuestionIds.add(qid);
                }
            }
            
            // If after validation, no valid questions remain
            if (validQuestionIds.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "None of the provided question IDs are valid");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Update the quiz with the new questions
            quiz.setQuestionIds(validQuestionIds.toArray(new Integer[0]));
            quiz.setMarks(totalMarks);
            
            // Save the updated quiz
            Quiz updatedQuiz = quizManagementService.saveQuiz(quiz);
            
            // Prepare success response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("quiz_id", updatedQuiz.getQuizId());
            responseBody.put("message", "Questions updated successfully");
            responseBody.put("previous_count", currentQuestionIds == null ? 0 : currentQuestionIds.length);
            responseBody.put("new_count", validQuestionIds.size());
            responseBody.put("updated_marks", updatedQuiz.getMarks());
            
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "updating quiz questions");
        }
    }
    
    
    @PostMapping("/{quizId}/edit/manual")
    public ResponseEntity<?> editQuizManually(
            @PathVariable Integer quizId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Extract parameters from request body
            Integer count = (Integer) requestBody.get("count");
            List<?> questionIdsList = (List<?>) requestBody.get("questionIds");
            
            // Validate parameters
            if (count == null || count <= 0) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid count parameter");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            if (questionIdsList == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Question IDs list is required");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Find the quiz
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            if (!quizOptional.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            Quiz quiz = quizOptional.get();
            Integer subjectId = quiz.getSubjectId();
            
            // Convert selected question IDs to a set of Integers
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
            
            // Get all available questions for the subject from question bank
            List<Integer> availableQuestionIds = new ArrayList<>();
            List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
            
            if (questionBanks.isEmpty() || questionBanks.get(0).getQuestionIds() == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "No questions available for this subject");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
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
            
            // If no valid questions were selected, return an error
            if (validSelectedQuestionIds.isEmpty() && !selectedQuestionIds.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "None of the selected questions belong to the specified subject");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
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
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Cannot create a quiz with zero questions");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Calculate total marks based on questions
            int totalMarks = 0;
            for (Integer qid : finalQuestionIds) {
                Optional<Question> question = questionService.getQuestionById(qid);
                if (question.isPresent()) {
                    totalMarks += question.get().getMarks();
                }
            }
            
            // Update the quiz
            quiz.setQuestionIds(finalQuestionIds.toArray(new Integer[0]));
            quiz.setMarks(totalMarks);
              // Update optional fields if provided
            String title = (String) requestBody.get("title");
            String description = (String) requestBody.get("description");
            Integer timeLimit = (Integer) requestBody.get("timeLimit");
            Object levelObj = requestBody.get("level");
            
            if (title != null) quiz.setTitle(title);
            if (description != null) quiz.setDescription(description);
            if (timeLimit != null) quiz.setTimelimit(timeLimit);
            
            // Handle level parameter to ensure it's in the correct format (1-4)
            if (levelObj != null) {
                String levelValue = "2"; // Default to medium/intermediate
                
                if (levelObj instanceof Integer) {
                    int levelInt = (Integer) levelObj;
                    if (levelInt >= 1 && levelInt <= 4) {
                        levelValue = String.valueOf(levelInt);
                    }
                } else if (levelObj instanceof String) {
                    String levelStr = (String) levelObj;
                    if (levelStr.equalsIgnoreCase("easy") || levelStr.equalsIgnoreCase("beginner") || levelStr.equals("1")) {
                        levelValue = "1";
                    } else if (levelStr.equalsIgnoreCase("medium") || levelStr.equalsIgnoreCase("intermediate") || levelStr.equals("2")) {
                        levelValue = "2";
                    } else if (levelStr.equalsIgnoreCase("hard") || levelStr.equalsIgnoreCase("advance") || levelStr.equals("3")) {
                        levelValue = "3";
                    } else if (levelStr.equalsIgnoreCase("mixed") || levelStr.equals("4")) {
                        levelValue = "4";
                    }
                }
                
                quiz.setLevel(levelValue);
            }
            
            // Ensure type is "Manual"
            quiz.setType("Manual");
              // Save the updated quiz
            Quiz updatedQuiz = quizManagementService.saveQuiz(quiz);
            
            // Remove the quiz from students' attempted quizzes and delete related reports
            int affectedStudents = studentService.removeQuizFromAllStudentsAttempted(quizId);
            int deletedReports = reportService.deleteReportsByQuizId(quizId);
            
            // Prepare success response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("quiz_id", updatedQuiz.getQuizId());
            responseBody.put("message", "Quiz updated successfully");
            responseBody.put("students_affected", affectedStudents);
            responseBody.put("reports_deleted", deletedReports);
            
            if (finalQuestionIds.size() < count) {
                responseBody.put("warning", "Not enough questions available. Updated quiz with " + 
                                finalQuestionIds.size() + " questions instead of " + count);
            }
            
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "editing quiz manually");
        }
    }
    
    
    @PostMapping("/{quizId}/edit/auto")
    public ResponseEntity<?> editQuizAutomatically(
            @PathVariable Integer quizId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Extract parameters from request body
            Integer count = (Integer) requestBody.get("count");
            Integer level = (Integer) requestBody.get("level");
            
            // Validate parameters
            if (count == null || count <= 0) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid count parameter");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Set default level to 2 if not provided
            if (level == null) {
                level = 2; // Default to medium difficulty
            }
            
            // Find the quiz
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            if (!quizOptional.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            Quiz quiz = quizOptional.get();
            Integer subjectId = quiz.getSubjectId();
            
            // Get questions based on the specified level for the subject
            List<Question> levelQuestions = new ArrayList<>();
            
            // For level 4, get a mix of easy, medium, and hard questions
            if (level == 4) {
                // Get questions of each difficulty level
                List<Question> easyQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 1);
                List<Question> mediumQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 2);
                List<Question> hardQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, 3);
                
                // Add all available questions to our pool
                if (easyQuestions != null) levelQuestions.addAll(easyQuestions);
                if (mediumQuestions != null) levelQuestions.addAll(mediumQuestions);
                if (hardQuestions != null) levelQuestions.addAll(hardQuestions);
            } else {
                // For levels 1, 2, 3, get questions of that specific level
                levelQuestions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, level);
            }
            
            if (levelQuestions == null || levelQuestions.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "No questions available for this subject with the specified level");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            // Create a list to store the final question IDs for the quiz
            List<Integer> finalQuestionIds = new ArrayList<>();
            
            // Check if we have enough questions to fulfill the requested count
            if (levelQuestions.size() >= count) {
                // Randomly select questions from the available ones
                Random random = new Random();
                Set<Integer> selectedIndices = new HashSet<>();
                
                while (finalQuestionIds.size() < count) {
                    int randomIndex = random.nextInt(levelQuestions.size());
                    if (!selectedIndices.contains(randomIndex)) {
                        selectedIndices.add(randomIndex);
                        Question question = levelQuestions.get(randomIndex);
                        finalQuestionIds.add(question.getQuestionId());
                    }
                }
            } else {
                // If we have fewer questions than requested, use all available
                for (Question question : levelQuestions) {
                    finalQuestionIds.add(question.getQuestionId());
                }
            }
            
            // Check if we have any questions after all our processing
            if (finalQuestionIds.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Cannot update quiz with zero questions");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Calculate total marks based on questions
            int totalMarks = 0;
            for (Integer qid : finalQuestionIds) {
                Optional<Question> question = questionService.getQuestionById(qid);
                if (question.isPresent()) {
                    totalMarks += question.get().getMarks();
                }
            }
            
            // Get existing question IDs
            Integer[] existingQuestionIds = quiz.getQuestionIds();
            int originalQuestionCount = existingQuestionIds != null ? existingQuestionIds.length : 0;
            
            // Combine existing questions with new questions
            List<Integer> combinedQuestionIds = new ArrayList<>();
            
            // Add existing questions first
            if (existingQuestionIds != null) {
                combinedQuestionIds.addAll(Arrays.asList(existingQuestionIds));
            }
            
            // Add new questions, avoiding duplicates
            for (Integer newId : finalQuestionIds) {
                if (!combinedQuestionIds.contains(newId)) {
                    combinedQuestionIds.add(newId);
                }
            }
            
            // Calculate total marks based on all questions
            totalMarks = 0;
            for (Integer qid : combinedQuestionIds) {
                Optional<Question> question = questionService.getQuestionById(qid);
                if (question.isPresent()) {
                    totalMarks += question.get().getMarks();
                }
            }
              // Update the quiz
            quiz.setQuestionIds(combinedQuestionIds.toArray(new Integer[0]));
            quiz.setMarks(totalMarks);
            
            // Ensure level is between 1-4
            if (level < 1 || level > 4) {
                level = 2; // Default to medium/intermediate if invalid
            }
            quiz.setLevel(String.valueOf(level)); // Set level as string representation of number
            quiz.setType("Automatic"); // Set quiz type as Automatic
            
            // Set appropriate title and description based on level
            String levelDesc = (level == 4) ? "Mixed" : String.valueOf(level);
            if (quiz.getTitle() != null && quiz.getTitle().startsWith("Auto Quiz")) {
                quiz.setTitle("Auto Quiz - Level " + levelDesc);
            }
            
            if (quiz.getDescription() != null && quiz.getDescription().startsWith("Automatically generated")) {
                quiz.setDescription(level == 4 ? 
                    "Automatically generated quiz with mixed difficulty levels" : 
                    "Automatically generated quiz with difficulty level " + level);
            }
              // Save the updated quiz
            Quiz updatedQuiz = quizManagementService.saveQuiz(quiz);
            
            // Remove the quiz from students' attempted quizzes and delete related reports
            int affectedStudents = studentService.removeQuizFromAllStudentsAttempted(quizId);
            int deletedReports = reportService.deleteReportsByQuizId(quizId);
            
            // Prepare success response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("quiz_id", updatedQuiz.getQuizId());
            responseBody.put("message", "Quiz updated successfully");
            responseBody.put("original_count", originalQuestionCount);
            responseBody.put("requested_to_add", count);
            responseBody.put("actually_added", finalQuestionIds.size()); 
            responseBody.put("total_questions", updatedQuiz.getQuestionIds().length);
            responseBody.put("level", level);
            responseBody.put("students_affected", affectedStudents);
            responseBody.put("reports_deleted", deletedReports);
            
            if (finalQuestionIds.size() < count) {
                responseBody.put("warning", "Not enough questions available at level " + level + ". Added " + finalQuestionIds.size() + " questions instead of " + count);
            }
            
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "updating quiz automatically");
        }
    }
    
   
    @DeleteMapping("/{quizId}/delete/{teacherId}")
    public ResponseEntity<?> deleteQuiz(
            @PathVariable Integer quizId,
            @PathVariable Integer teacherId) {
        try {
            // Check if teacher exists
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Teacher not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            // Check if quiz exists
            Optional<Quiz> quizOptional = quizManagementService.getQuizById(quizId);
            if (!quizOptional.isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            
            // Verify that the quiz was created by this teacher
            Integer[] createdQuizIds = teacher.getCreatedQuiz();
            boolean isQuizCreatedByTeacher = false;
            
            if (createdQuizIds != null) {
                for (Integer id : createdQuizIds) {
                    if (id.equals(quizId)) {
                        isQuizCreatedByTeacher = true;
                        break;
                    }
                }
            }
            
            if (!isQuizCreatedByTeacher) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "This teacher is not authorized to delete this quiz");
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
            }
            
            // Delete the quiz from the database
            quizManagementService.deleteQuiz(quizId);
            
            // Remove the quiz ID from teacher's createdQuiz array
            List<Integer> updatedCreatedQuiz = new ArrayList<>();
            for (Integer id : createdQuizIds) {
                if (!id.equals(quizId)) {
                    updatedCreatedQuiz.add(id);
                }
            }
              // Update teacher's createdQuiz array
            teacher.setCreatedQuiz(updatedCreatedQuiz.toArray(new Integer[0]));
            teacherService.updateTeacher(teacher);
            
            // Prepare success response
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Quiz deleted successfully");
            
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
            
        } catch (Exception e) {
            return handleInternalServerError(e, "deleting quiz");
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
    
    // Helper method to handle internal server errors
    private ResponseEntity<?> handleInternalServerError(Exception e, String operation) {
        e.printStackTrace();
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Internal error while " + operation);
        errorResponse.put("error", e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
