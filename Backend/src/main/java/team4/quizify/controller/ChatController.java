package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Chat;
import team4.quizify.service.ChatService;

import java.util.List;
@RestController
@RequestMapping("/Quizify/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;



    //  Get all messages between two users (teacher and student)
    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<Chat>> getAllMessagesBetweenUsers(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        return ResponseEntity.ok(chatService.getMessagesBetweenUsers(userId1, userId2));
    }

    // Post a message (sender -> receiver)
    @PostMapping("/{senderId}/{receiverId}/message")
    public ResponseEntity<Chat> sendMessage(
            @PathVariable int senderId,
            @PathVariable int receiverId,
            @RequestBody Chat chat
    ) {
        chatService.mapSenderReceiverToUserIds(chat, senderId, receiverId);
        return ResponseEntity.ok(chatService.sendMessage(chat));
    }

    // Delete all messages between two users
    @DeleteMapping("/{userId1}/{userId2}")
    public ResponseEntity<String> deleteMessagesBetweenUsers(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        boolean deleted = chatService.deleteMessagesBetweenUsers(userId1, userId2);
        if (!deleted) {
            return ResponseEntity.status(404).body("No messages found between the given users.");
        }
        return ResponseEntity.ok("All messages deleted successfully.");
    }

    //Get unresolved query status
    @GetMapping("/{userId1}/{userId2}/unresolved")
    public ResponseEntity<Boolean> isQueryUnresolved(
            @PathVariable int userId1,
            @PathVariable int userId2
    ) {
        return ResponseEntity.ok(chatService.isQueryUnresolved(userId1, userId2));
    }

    // Get all teachers by subject
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getTeachersBySubject(@RequestParam Integer subjectId) {
        return ResponseEntity.ok(chatService.getTeachersBySubject(subjectId));
    }

    // Mark unread by teacher
    @PatchMapping("/{senderId}/{receiverId}/unreadbyTeacher")
    public ResponseEntity<Void> markUnreadByTeacher(
            @PathVariable int senderId,
            @PathVariable int receiverId
    ) {
        chatService.markUnreadByTeacher(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    //  Mark unread by student
    @PatchMapping("/{senderId}/{receiverId}/unreadbyStudent")
    public ResponseEntity<Void> markUnreadByStudent(
            @PathVariable int senderId,
            @PathVariable int receiverId
    ) {
        chatService.markUnreadByStudent(senderId, receiverId);
        return ResponseEntity.ok().build();
    }
    // Get all opposite party names based on userId (student -> teachers or teacher -> students)
    @GetMapping("/{userId}/oppositeUsers")
    public ResponseEntity<List<String>> getOppositeUsers(@PathVariable int userId) {
        return ResponseEntity.ok(chatService.getOppositePartyNames(userId));
    }


}
