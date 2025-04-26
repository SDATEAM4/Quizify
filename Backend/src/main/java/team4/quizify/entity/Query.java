package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "query")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Query {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "query_id")
    private Long queryId;
    
    @Column(name = "student_id", nullable = false)
    private Integer studentId;
    
    @Column(name = "teacher_id", nullable = false)
    private Integer teacherId;
    
    @Column(name = "subject_id", nullable = false)
    private Integer subjectId;
    
    @Column(name = "resolve_status", nullable = false)
    private Boolean resolveStatus = false;
    
    // Using ArrayList to store chat_ids as text array
    @ElementCollection
    @CollectionTable(name = "query_chat_ids", 
                    joinColumns = @JoinColumn(name = "query_id"))
    @Column(name = "chat_id")
    private List<String> chatIds = new ArrayList<>();
}
