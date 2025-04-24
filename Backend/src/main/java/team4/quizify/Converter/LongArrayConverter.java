package team4.quizify.Converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter
public class LongArrayConverter implements AttributeConverter<Long[], String> {

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
