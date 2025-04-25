
package team4.quizify.entity;

import jakarta.persistence.*;
        import lombok.*;

        import java.util.Arrays;

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
    @Convert(converter = Query.LongArrayInlineConverter.class)
    private Long[] chatIds;

    @Converter
    public static class LongArrayInlineConverter implements AttributeConverter<Long[], String> {

        @Override
        public String convertToDatabaseColumn(Long[] attribute) {
            if (attribute == null) return null;
            return Arrays.toString(attribute)
                    .replace("[", "{")
                    .replace("]", "}");
        }

        @Override
        public Long[] convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.length() < 2) return new Long[0];
            String[] values = dbData.substring(1, dbData.length() - 1).split(",");
            return Arrays.stream(values)
                    .map(String::trim)
                    .map(Long::parseLong)
                    .toArray(Long[]::new);
        }
    }
}

