package team4.quizify.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherReport {
    private Integer quizId;
    private Integer totalStudentsAttempted;
    private Double averageMarks;
    private Integer maximumMarks;
    private Integer minimumMarks;
    private Integer totalAvailableMarks;
    
    // Optional 
    private String quizLevel;
    private String quizType;
    private Integer timeLimit;
    private Integer subjectId;
}
