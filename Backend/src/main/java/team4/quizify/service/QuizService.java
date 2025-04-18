package team4.quizify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import team4.quizify.entity.Quiz;

@Service
public class QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);

    @Value("${openrouter.api.key}")
    private String apiKey;    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Quiz> generateQuiz(String subject, String level, int numQuestions) {
        String url = "https://openrouter.ai/api/v1/chat/completions";
        
        // logger.info("Generating quiz for subject: {}, level: {}, questions: {}", subject, level, numQuestions);
        
        // Creating headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://quizify-app.com");
        headers.set("X-Title", "Quizify");

          // Building the prompt
        String prompt = buildPrompt(subject, level, numQuestions);
        // logger.info("Generated prompt: {}", prompt);
        
          // Request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "qwen/qwen2.5-coder-7b-instruct");
        
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        
        requestBody.put("messages", messages);
        
        // // Log the request body for debugging
        // try {
        //     // logger.info("Request body: {}", objectMapper.writeValueAsString(requestBody));
        // } catch (JsonProcessingException e) {
        //     // logger.error("Error serializing request body", e);
        // }
        
        // Creating the request entity
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
          // API call
        // logger.info("Making API request to: {}", url);
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);
            // Log the response for debugging
            // logger.info("Received API response: {}", response);
            
            // Process the response
            List<Quiz> quizzes = parseQuizResponse(response);
            // logger.info("Parsed {} quiz questions", quizzes.size());
            
            // Limit the number of questions if we got more than requested
            if (quizzes.size() > numQuestions) {
                return quizzes.subList(0, numQuestions);
            }
            
            return quizzes;
        } catch (Exception e) {
            // logger.error("Error making API request", e);
            throw e;
        }
    }
      private String buildPrompt(String subject, String level, int numQuestions) {
        String difficultyPrompt = level.equalsIgnoreCase("mix") ? 
                "mixed difficulty levels (easy, medium, and hard)" : 
                level.toLowerCase() + " difficulty level";
                
        return "I need " + numQuestions + " multiple-choice questions (MCQs) for the subject \"" + subject + 
               "\" with " + difficultyPrompt + ". Each question should have 4 options labeled a), b), c), and d). " +
               "I need the output in pure JSON format only (no explanation, no extra text, no markdown). " +
               "Each question object should include a question, options (as an object with keys a, b, c, d), " +
               "and answer (the correct option's key, like \"a\"). " +
               "This is for a project, so do not include any text like \"Here are your MCQs\" or \"Qx may need more clarification.\" " +
               "Just return the raw JSON.";
    }      private List<Quiz> parseQuizResponse(Map<String, Object> response) {
        List<Quiz> quizzes = new ArrayList<>();
        
        // logger.info("Parsing response: {}", response);
        
        try {
            // Extracting the content from the response
            if (response == null) {
                // logger.error("Response is null");
                return quizzes;
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                // logger.error("No choices found in response: {}", response.keySet());
                return quizzes;
            }
            
            // logger.info("Found {} choices", choices.size());
            Map<String, Object> choice = choices.get(0);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choice.get("message");
            if (message == null) {
                // logger.error("No message found in choice: {}", choice.keySet());
                return quizzes;
            }
            
            String content = (String) message.get("content");
            if (content == null || content.isEmpty()) {
                // logger.error("Content is null or empty");
                return quizzes;
            }
            
            // logger.info("Raw content from API: {}", content);
            
            // Try to clean the content in case it's not pure JSON
            content = cleanJsonContent(content);
            
            // Parse the JSON string to a list of Quiz objects
            quizzes = objectMapper.readValue(content, new TypeReference<List<Quiz>>() {});
            // logger.info("Successfully parsed {} quiz questions", quizzes.size());
        } catch (JsonProcessingException e) {
            // logger.error("JSON parsing error", e);
            // logger.error("Error message: {}", e.getMessage());
        } catch (Exception e) {
            // logger.error("Unexpected error parsing response", e);
            // logger.error("Error message: {}", e.getMessage());
        }
        
        return quizzes;
    }
    
    private String cleanJsonContent(String content) {
        // Sometimes the API might return JSON with extra text before or after
        // Try to extract just the JSON array part
        try {
            String trimmed = content.trim();
            int start = trimmed.indexOf('[');
            int end = trimmed.lastIndexOf(']') + 1;
            
            if (start >= 0 && end > start) {
                String jsonArrayPart = trimmed.substring(start, end);
                // logger.info("Extracted JSON array: {}", jsonArrayPart);
                return jsonArrayPart;
            }
        } catch (Exception e) {
            logger.error("Error cleaning JSON content", e);
        }
        
        return content;
    }
}
