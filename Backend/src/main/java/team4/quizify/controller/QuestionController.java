package team4.quizify.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Question;
import team4.quizify.config.MessageResponse;
import team4.quizify.service.QuestionService;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/questions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // GET all questions
    @GetMapping
    public ResponseEntity<?> getAllQuestions() {
        try {
            List<Question> questions = questionService.getAllQuestions();
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }    
    
    // GET question by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable("id") Integer id) {
        try {
            Optional<Question> questionData = questionService.getQuestionById(id);
            if (questionData.isPresent()) {
                return new ResponseEntity<>(questionData.get(), HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Question not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }   
    
    // GET questions by subject ID
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getQuestionsBySubjectId(@PathVariable("subjectId") Integer subjectId) {
        try {
            List<Question> questions = questionService.getQuestionsBySubjectId(subjectId);
            if (questions.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Question not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET questions by level
    @GetMapping("/level/{level}")
    public ResponseEntity<?> getQuestionsByLevel(@PathVariable("level") Integer level) {
        try {
            List<Question> questions = questionService.getQuestionsByLevel(level);
            if (questions.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Question not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET questions by subject ID and level
    @GetMapping("/subject/{subjectId}/level/{level}")
    public ResponseEntity<?> getQuestionsBySubjectIdAndLevel(
            @PathVariable("subjectId") Integer subjectId,
            @PathVariable("level") Integer level) {
        try {
            List<Question> questions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, level);
            if (questions.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Question not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }    
    
    // POST a new question
    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.createQuestion(question);
        
        // Add the newly created question to the corresponding question bank
        questionService.addQuestionToBank(savedQuestion);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Question created successfully");
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // PUT update a question
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable("id") Integer id,
            @RequestBody Question question) {
        Optional<Question> questionData = questionService.getQuestionById(id);
        if (questionData.isPresent()) {
            Question updatedQuestion = questionData.get();
            updatedQuestion.setStatement(question.getStatement());
            updatedQuestion.setMarks(question.getMarks());
            updatedQuestion.setLevel(question.getLevel());
            updatedQuestion.setSubjectId(question.getSubjectId());
            updatedQuestion.setCorrectOption(question.getCorrectOption());
            updatedQuestion.setOptions(question.getOptions());
            
           questionService.updateQuestion(updatedQuestion);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Question updated successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new MessageResponse("Question not found"), HttpStatus.NOT_FOUND);
        }
    }

    // DELETE a question
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable("id") Integer id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().body(new MessageResponse("Question deleted successfully"));
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse("Internal error while deleting question"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
