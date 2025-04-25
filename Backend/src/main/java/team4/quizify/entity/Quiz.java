package team4.quizify.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    
    @Column(name = "question_ids", columnDefinition = "integer[]")
    private Integer[] questionIds;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;
}
