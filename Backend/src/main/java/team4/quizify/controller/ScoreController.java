package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Report;
import team4.quizify.service.ReportService;

@RestController
@RequestMapping("/Quizify/scores")
@CrossOrigin("*")
public class ScoreController {

    @Autowired
    private ReportService reportService;

  
    @PostMapping
    public ResponseEntity<Report> submitQuizScore(@RequestBody Report report) {
        try {
            Report savedReport = reportService.saveQuizScore(report);
            return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get all reports for a specific user
     * @param userId The ID of the user
     * @return List of reports for the user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReportsByUserId(@PathVariable Integer userId) {
        try {
            return new ResponseEntity<>(reportService.getReportsByUserId(userId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get all reports for a specific quiz
     * @param quizId The ID of the quiz
     * @return List of reports for the quiz
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<?> getReportsByQuizId(@PathVariable Integer quizId) {
        try {
            return new ResponseEntity<>(reportService.getReportsByQuizId(quizId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
