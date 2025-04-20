package team4.quizify.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quiz")
public class Quiz {
    
    @Id
    @Column(name = "quiz_id")
    private Integer quizId;
    
    @Column(name = "subject_id")
    private Integer subjectId;
    
    @Column(name = "marks")
    private Integer marks;
    
    @Column(name = "level")
    private String level;
    
    @Column(name = "timelimit")
    private Integer timelimit;
    
    @Column(name = "type")
    private String type;
    
    @Column(name = "question_ids")
    private String questionIds;
}
