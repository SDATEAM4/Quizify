package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;
    
    @Column(name = "sender_id", nullable = false)
    private Integer senderId;
    
    @Column(name = "receiver_id", nullable = false)
    private Integer receiverId;
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "subject_id")
    private Integer subjectId;
    
    @Column(name = "query_id")
    private Long queryId;
}
