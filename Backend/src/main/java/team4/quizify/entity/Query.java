package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "query")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queryId;

    private int senderId;
    private int receiverId;
    private Boolean resolveStatus = false;

    @Column(name = "chat_ids", columnDefinition = "bigint[]")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    private Long[] chatIds;
}
