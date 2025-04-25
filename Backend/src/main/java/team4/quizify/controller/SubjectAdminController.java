package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Subject;
import team4.quizify.service.SubjectService;
import team4.quizify.service.CloudinaryService;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/Quizify/admin/subjects")
@CrossOrigin(origins = "*")
public class SubjectAdminController {

    @Autowired
    private SubjectService subjectService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
   
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
    
    
    @GetMapping("/{subjectId}")
    public ResponseEntity<?> getSubjectById(@PathVariable Integer subjectId) {
        Optional<Subject> subject = subjectService.getSubjectById(subjectId);
        if (subject.isPresent()) {
            return ResponseEntity.ok(subject.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Subject not found"));
        }
    }
    

    @PostMapping
    public ResponseEntity<?> addSubject(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "subjectImage", required = false) MultipartFile subjectImage) {
        try {
            // Create new subject entity
            Subject subject = new Subject();
            subject.setName(name);
            subject.setDescription(description);
            
            // Handle image upload if provided
            if (subjectImage != null && !subjectImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(subjectImage);
                subject.setImageUrl(imageUrl);
            }
            
            // Initialize with empty teachers array
            subject.setTeachersId(new Integer[0]);
            
            // Save the subject
             subjectService.saveSubject(subject);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "message", "Subject added successfully"
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add subject"));
        }
    }
     

    @PutMapping("/{subjectId}")
    public ResponseEntity<?> updateSubject(
            @PathVariable Integer subjectId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "subjectImage", required = false) MultipartFile subjectImage) {
        try {
            // Get existing subject
            Optional<Subject> existingSubjectOpt = subjectService.getSubjectById(subjectId);
            if (!existingSubjectOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found"));
            }
            
            Subject existingSubject = existingSubjectOpt.get();
            
            // Update name if provided
            if (name != null && !name.isEmpty()) {
                existingSubject.setName(name);
            }
            
            // Update description if provided
            if (description != null) {
                existingSubject.setDescription(description);
            }
            
            // Update image if provided
            if (subjectImage != null && !subjectImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(subjectImage);
                existingSubject.setImageUrl(imageUrl);
            }
            
            // Save the updated subject
            Subject updatedSubject = subjectService.saveSubject(existingSubject);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update subject"));
        }
    }
    
   
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable Integer subjectId) {
        try {
            // Check if subject exists
            Optional<Subject> subject = subjectService.getSubjectById(subjectId);
            if (!subject.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found"));
            }
            
            // Delete the subject
            subjectService.deleteSubject(subjectId);
            
            return ResponseEntity.ok(Map.of("message", "Subject deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete subject"));
        }
    }
}
