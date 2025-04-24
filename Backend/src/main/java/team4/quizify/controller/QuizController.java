package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Quiz;
import team4.quizify.service.QuizManagementService;

import java.util.List;

@RestController
@RequestMapping("/Quizify/quizzes")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizManagementService quizManagementService;

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizManagementService.getAllQuizzes();
            return new ResponseEntity<>(quizzes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  
    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Integer quizId) {
        try {
            return quizManagementService.getQuizById(quizId)
                    .map(quiz -> new ResponseEntity<>(quiz, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Quiz>> getQuizzesBySubject(@PathVariable Integer subjectId) {
        try {
            List<Quiz> quizzes = quizManagementService.getQuizzesBySubject(subjectId);
            return new ResponseEntity<>(quizzes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
