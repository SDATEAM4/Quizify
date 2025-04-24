package team4.quizify.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "obtain_marks")
    private Integer obtainMarks;
    
    @Column(name = "quiz_id")
    private Integer quizId;
    
    @Column(name = "points")
    private Integer points;
}
