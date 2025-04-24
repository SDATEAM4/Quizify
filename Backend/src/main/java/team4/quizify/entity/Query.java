package team4.quizify.entity;

import jakarta.persistence.*;
import lombok.*;
import team4.quizify.Converter.LongArrayConverter;

@Entity
@Table(name = "query")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queryId;

    private Long senderId;
    private Long receiverId;
    private Boolean resolveStatus = false;

    @Column(name = "chat_ids", columnDefinition = "bigint[]")
    @Convert(converter = LongArrayConverter.class)
    private Long[] chatIds;
}
