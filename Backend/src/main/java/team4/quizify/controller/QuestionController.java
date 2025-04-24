package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Question;
import team4.quizify.config.MessageResponse;
import team4.quizify.service.QuestionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Quizify/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // GET all questions
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }    
    
    // GET question by ID
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable("id") Integer id) {
        Optional<Question> questionData = questionService.getQuestionById(id);
        return questionData.map(question -> new ResponseEntity<>(question, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }   
    
    // GET questions by subject ID
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Question>> getQuestionsBySubjectId(@PathVariable("subjectId") Integer subjectId) {
        List<Question> questions = questionService.getQuestionsBySubjectId(subjectId);
        if (questions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    // GET questions by level
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Question>> getQuestionsByLevel(@PathVariable("level") Integer level) {
        List<Question> questions = questionService.getQuestionsByLevel(level);
        if (questions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    // GET questions by subject ID and level
    @GetMapping("/subject/{subjectId}/level/{level}")
    public ResponseEntity<List<Question>> getQuestionsBySubjectIdAndLevel(
            @PathVariable("subjectId") Integer subjectId,
            @PathVariable("level") Integer level) {
        List<Question> questions = questionService.getQuestionsBySubjectIdAndLevel(subjectId, level);
        if (questions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }    
    
    // POST a new question
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.createQuestion(question);
        
        // Add the newly created question to the corresponding question bank
        questionService.addQuestionToBank(savedQuestion);
        
        return new ResponseEntity<>(savedQuestion, HttpStatus.CREATED);
    }
    
    // PUT update a question
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
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
            
            return new ResponseEntity<>(questionService.updateQuestion(updatedQuestion), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE a question
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable("id") Integer id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().body(new MessageResponse("Question deleted successfully"));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
