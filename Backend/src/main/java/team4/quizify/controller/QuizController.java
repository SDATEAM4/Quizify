package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import team4.quizify.entity.Quiz;
import team4.quizify.service.QuizService;

import java.util.List;

@RestController
@RequestMapping("/Quizify")
public class QuizController {
      @Autowired
    private QuizService quizService;
    
    @GetMapping("/practiceQuiz")
    public List<Quiz> getPracticeQuiz(
            @RequestParam String subject,
            @RequestParam(required = false, defaultValue = "mix") String level,
            @RequestParam(required = false, defaultValue = "5") int numQuestions) {
        
        // Validate number of questions (max 20)
        if (numQuestions > 20) {
            numQuestions = 20;
        } else if (numQuestions < 1) {
            numQuestions = 5;
        }
        
        return quizService.generateQuiz(subject, level, numQuestions);
    }
}
