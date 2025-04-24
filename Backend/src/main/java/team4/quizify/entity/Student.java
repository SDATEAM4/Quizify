package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer student_id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;
    
    @Column(name = "attempted_quiz", columnDefinition = "integer[]")
    private Integer[] attemptedQuiz;
    
    @Column(name = "enrolled_subjects", columnDefinition = "integer[]")
    private Integer[] enrolledSubjects;
}
