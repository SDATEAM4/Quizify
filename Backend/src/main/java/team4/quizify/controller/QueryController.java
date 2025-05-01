package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Query;
import team4.quizify.service.QueryService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/chats")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @GetMapping("/unresolved")
    public ResponseEntity<?> getUnresolvedQueries(@RequestParam int teacherId) {
        try {
            List<Query> queries = queryService.getUnresolvedQueriesForTeacher(teacherId);
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return handleException();
        }
    }

    @DeleteMapping("/resolve/{queryId}")
    public ResponseEntity<?> resolveQuery(@PathVariable Long queryId) {
        try {
            boolean resolved = queryService.resolveQueryAndDeleteChats(queryId);
            if (!resolved) {
                return ResponseEntity.status(404).body("Query not found or already resolved.");
            }
            return ResponseEntity.ok("Query and related chats deleted successfully.");
        } catch (Exception e) {
            return handleException();
        }
    }

    @GetMapping("/unresolved/users")
    public ResponseEntity<?> getUnresolvedUserList(@RequestParam int userId) {
        try {
            List<Map<String, Object>> result = queryService.getUnresolvedUsersByRole(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleException();
        }
    }

    private ResponseEntity<Map<String, String>> handleException() {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Request failed");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
