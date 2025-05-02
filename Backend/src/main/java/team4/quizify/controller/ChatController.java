package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Chat;
import team4.quizify.service.ChatService;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/Quizify/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<?> getAllMessagesBetweenUsers(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        try {
            return ResponseEntity.ok(chatService.getMessagesBetweenUsers(userId1, userId2));
        } catch (Exception e) {
            return handleException();
        }
    }

    @PostMapping("/{senderId}/{receiverId}/message")
    public ResponseEntity<?> sendMessage(
            @PathVariable int senderId,
            @PathVariable int receiverId,
            @RequestParam(required = false) Integer subjectId,
            @RequestBody Chat chat
    ) {
        try {
            chatService.mapSenderReceiverToUserIds(chat, senderId, receiverId);
            return ResponseEntity.ok(chatService.sendMessage(chat, subjectId));
        } catch (Exception e) {
            return handleException();
        }
    }

    @DeleteMapping("/{userId1}/{userId2}")
    public ResponseEntity<?> deleteMessagesBetweenUsers(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        try {
            boolean deleted = chatService.deleteMessagesBetweenUsers(userId1, userId2);
            if (!deleted) {
                return ResponseEntity.status(404).body("No messages found between the given users.");
            }
            return ResponseEntity.ok("All messages deleted successfully.");
        } catch (Exception e) {
            return handleException();
        }
    }

    @GetMapping("/{userId1}/{userId2}/unresolved")
    public ResponseEntity<?> isQueryUnresolved(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        try {
            return ResponseEntity.ok(chatService.isQueryUnresolved(userId1, userId2));
        } catch (Exception e) {
            return handleException();
        }
    }

    @PatchMapping("/{senderId}/{receiverId}/unreadbyTeacher")
    public ResponseEntity<?> markUnreadByTeacher(
            @PathVariable int senderId,
            @PathVariable int receiverId
    ) {
        try {
            chatService.markUnreadByTeacher(senderId, receiverId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return handleException();
        }
    }

    @PatchMapping("/{senderId}/{receiverId}/unreadbyStudent")
    public ResponseEntity<?> markUnreadByStudent(
            @PathVariable int senderId,
            @PathVariable int receiverId
    ) {
        try {
            chatService.markUnreadByStudent(senderId, receiverId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return handleException();
        }
    }

    @GetMapping("/{userId}/oppositeUsers")
    public ResponseEntity<?> getOppositeUsers(@PathVariable int userId) {
        try {
            return ResponseEntity.ok(chatService.getOppositePartyNames(userId));
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
