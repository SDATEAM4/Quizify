package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Quiz;
import team4.quizify.service.QuizManagementService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/quizzes")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizManagementService quizManagementService;

    @GetMapping
    public ResponseEntity<?> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizManagementService.getAllQuizzes();
            return new ResponseEntity<>(quizzes, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Integer quizId) {
        try {
            return quizManagementService.getQuizById(quizId)
                    .map(quiz -> new ResponseEntity<Object>(quiz, HttpStatus.OK))
                    .orElseGet(() -> {
                        Map<String, String> errorResponse = new HashMap<>();
                        errorResponse.put("message", "Quiz not found");
                        return new ResponseEntity<Object>(errorResponse, HttpStatus.BAD_REQUEST);
                    });
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getQuizzesBySubject(@PathVariable Integer subjectId) {
        try {
            List<Quiz> quizzes = quizManagementService.getQuizzesBySubject(subjectId);
            if (quizzes.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Quiz not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(quizzes, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
