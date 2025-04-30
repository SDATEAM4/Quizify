# Quizify Application Design Patterns Guide
This document provides an overview of the design patterns implemented in the Quizify application, along with the API flow when different endpoints are called.

## Table of Contents
1. [Design Patterns](#design-patterns)
   - [Singleton Pattern](#singleton-pattern)
   - [Template Method Pattern](#template-method-pattern)
   - [Adapter Pattern](#adapter-pattern)
   - [Factory Pattern](#factory-pattern)
2. [API Flow and Pattern Usage](#api-flow-and-pattern-usage)
   - [User Management APIs](#user-management-apis)
   - [Authentication APIs](#authentication-apis)
   - [Quiz Management APIs](#quiz-management-apis)
   - [Report Generation APIs](#report-generation-apis)

## Design Patterns

### Singleton Pattern

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. This pattern is useful when we need exactly one object to coordinate actions across the system.

#### Implementation in Quizify:

The Singleton pattern is implemented for the following services:

1. **AdminServiceSingleton**
   - File Path: `Backend/src/main/java/team4/quizify/patterns/singleton/AdminServiceSingleton.java`
   - Package: `team4.quizify.patterns.singleton.AdminServiceSingleton`
   - Purpose: Ensures that only one instance of AdminService exists throughout the application.
   - Usage: Used in AdminController to manage user creation and other admin operations.
   - Implementation: Used getInstance.

2. **CloudinaryServiceSingleton**
   - File Path: `Backend/src/main/java/team4/quizify/patterns/singleton/CloudinaryServiceSingleton.java`
   - Package: `team4.quizify.patterns.singleton.CloudinaryServiceSingleton`
   - Purpose: Provides a single instance for Cloudinary service operations.
   - Usage: Used for file upload operations throughout the application.

3. **AuthServiceSingleton**
   - File Path: `Backend/src/main/java/team4/quizify/patterns/singleton/AuthServiceSingleton.java`
   - Package: `team4.quizify.patterns.singleton.AuthServiceSingleton`
   - Purpose: Ensures a single instance for authentication operations.
   - Usage: Used for user authentication processes.

4. **OpenRouterServiceSingleton**
   - File Path: `Backend/src/main/java/team4/quizify/patterns/singleton/OpenRouterServiceSingleton.java`
   - Package: `team4.quizify.patterns.singleton.OpenRouterServiceSingleton`
   - Purpose: Provides a single instance for AI router service.
   - Usage: Used for AI-powered quiz generation and features.

#### Implementation Example:

```java
// File: Backend/src/main/java/team4/quizify/patterns/singleton/AdminServiceSingleton.java
package team4.quizify.patterns.singleton;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import team4.quizify.service.AdminService;

@Component
public class AdminServiceSingleton {
    private static AdminServiceSingleton instance;
    private final AdminService adminService;
    
    private AdminServiceSingleton(ApplicationContext context) {
        this.adminService = context.getBean(AdminService.class);
    }
    
    public static synchronized AdminServiceSingleton getInstance(ApplicationContext context) {
        if (instance == null) {
            instance = new AdminServiceSingleton(context);
        }
        return instance;
    }
    
    public AdminService getAdminService() {
        return adminService;
    }
}
```

### Template Method Pattern

The Template Method pattern defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.

#### Implementation in Quizify:

The Template Method pattern is implemented for user creation and quiz generation:

1. **User Creation Template Pattern**
   - Abstract Base Class: 
     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/UserCreationTemplate.java`
     - Package: `team4.quizify.patterns.template.UserCreationTemplate`
     - Purpose: Defines the sequence of steps for creating a user.
     - Abstract methods:
       - `validateUserData`: Validates username and email uniqueness
       - `processProfileImage`: Handles profile image upload
       - `createBaseUser`: Creates the base user object
       - `createRoleSpecificUser`: Role-specific user creation logic

   - Concrete implementations:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/StudentCreationTemplate.java`
       - Package: `team4.quizify.patterns.template.StudentCreationTemplate`
       - Purpose: Implements user creation specific to students.

     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/TeacherCreationTemplate.java`
       - Package: `team4.quizify.patterns.template.TeacherCreationTemplate`
       - Purpose: Implements user creation specific to teachers.

2. **Quiz Generation Template Pattern**
   - Abstract Base Class: 
     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/QuizGenerationTemplate.java`
     - Package: `team4.quizify.patterns.template.QuizGenerationTemplate`
     - Purpose: Defines the sequence of steps for generating quizzes.

   - Concrete implementations:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/AutoQuizGenerationTemplate.java`
       - Package: `team4.quizify.patterns.template.AutoQuizGenerationTemplate` 
       - Purpose: Implements automatic quiz creation by teachers.

     - File Path: `Backend/src/main/java/team4/quizify/patterns/template/ManualQuizGenerationTemplate.java`
       - Package: `team4.quizify.patterns.template.ManualQuizGenerationTemplate`
       - Purpose: Implements manual quiz creation by teachers.

        - File Path: `Backend/src/main/java/team4/quizify/patterns/template/PracticeQuizGenerationTemplate.java`
       - Package: `team4.quizify.patterns.template.PracticeQuizGenerationTemplate` 
       - Purpose: Implements AI-powered automatic quiz generation.

#### Implementation Example:

```java
// File: Backend/src/main/java/team4/quizify/patterns/template/UserCreationTemplate.java
package team4.quizify.patterns.template;

import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;

public abstract class UserCreationTemplate {
    
    public final User createUser(String fname, String lname, String username, String password, 
                              String email, String role, MultipartFile profileImage) {
        
        // Validate user data
        validateUserData(username, email);
        
        // Process profile image
        String profileImageUrl = processProfileImage(profileImage);
        
        // Create base user
        User user = createBaseUser(fname, lname, username, password, email, role, profileImageUrl);
        
        // Create role-specific user
        return createRoleSpecificUser(user);
    }
    
    // Abstract methods to be implemented by concrete subclasses
    protected abstract void validateUserData(String username, String email);
    protected abstract String processProfileImage(MultipartFile profileImage);
    protected abstract User createBaseUser(String fname, String lname, String username, String password, 
                                     String email, String role, String profileImageUrl);
    protected abstract User createRoleSpecificUser(User user);
}
```

**Student Creation Template Implementation:**

```java
// File: Backend/src/main/java/team4/quizify/patterns/template/StudentCreationTemplate.java
package team4.quizify.patterns.template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Student;
import team4.quizify.entity.User;
import team4.quizify.patterns.adapter.StorageManager;
import team4.quizify.repository.StudentRepository;
import team4.quizify.service.UserService;

@Component
public class StudentCreationTemplate extends UserCreationTemplate {

    @Autowired
    private UserService userService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StorageManager storageManager;

    @Override
    protected void validateUserData(String username, String email) {
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Override
    protected String processProfileImage(MultipartFile profileImage) {
        if (profileImage != null && !profileImage.isEmpty()) {
            return storageManager.uploadFile(profileImage);
        }
        return null;
    }

    // Other method implementations...
}
```

### Adapter Pattern

The Adapter pattern converts the interface of a class into another interface that clients expect. It enables classes to work together that couldn't otherwise due to incompatible interfaces.

#### Implementation in Quizify:

1. **Target Interface**
   - File Path: `Backend/src/main/java/team4/quizify/patterns/adapter/StorageService.java`
   - Package: `team4.quizify.patterns.adapter.StorageService`
   - Purpose: Defines common storage operations for file management.
   - Methods:
     - `uploadFile`: Uploads a file to storage and returns the URL

2. **Adapter**:
   - File Path: `Backend/src/main/java/team4/quizify/patterns/adapter/CloudinaryStorageAdapter.java`
   - Package: `team4.quizify.patterns.adapter.CloudinaryStorageAdapter`
   - Purpose: Adapts the CloudinaryService to the StorageService interface.
   - Implementation: Forwards calls to the adapted CloudinaryService

3. **Adaptee**:
   - Package: `team4.quizify.service.CloudinaryService`
   - Purpose: Provides functionality to upload files to Cloudinary.
   - Incompatibility: Has a different interface than what the client expects.

4. **Client/Manager**:
   - File Path: `Backend/src/main/java/team4/quizify/patterns/adapter/StorageManager.java`
   - Package: `team4.quizify.patterns.adapter.StorageManager`
   - Purpose: Selects the appropriate storage adapter based on configuration.
   - Usage: Centralizes file storage operations across the application.

#### Implementation Examples:

**Target Interface (StorageService):**

```java
// File: Backend/src/main/java/team4/quizify/patterns/adapter/StorageService.java
package team4.quizify.patterns.adapter;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String uploadFile(MultipartFile file);
}
```

**Adapter (CloudinaryStorageAdapter):**

```java
// File: Backend/src/main/java/team4/quizify/patterns/adapter/CloudinaryStorageAdapter.java
package team4.quizify.patterns.adapter;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.service.CloudinaryService;

@Service
public class CloudinaryStorageAdapter implements StorageService {

    private final CloudinaryService cloudinaryService;
    
    public CloudinaryStorageAdapter(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }
}
```

**Client (StorageManager):**

```java
// File: Backend/src/main/java/team4/quizify/patterns/adapter/StorageManager.java
package team4.quizify.patterns.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageManager {
    @Value("${storage.type:cloudinary}")
    private String storageType;
    
    @Autowired
    private CloudinaryStorageAdapter cloudinaryStorageAdapter;
    
    public StorageService getStorageService() {
        return cloudinaryStorageAdapter;
    }
    
    public String uploadFile(MultipartFile file) {
        return getStorageService().uploadFile(file);
    }
}
```

### Factory Pattern

The Factory pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

#### Implementation in Quizify:

Quizify implements multiple Factory patterns for different entity types:

1. **User Factory Pattern**
   
   - **Factory Interface**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/UserFactory.java`
     - Package: `team4.quizify.patterns.factory.UserFactory`
     - Purpose: Defines the contract for creating user objects.
     - Method: `createUser`: Creates a user with specified attributes.

   - **Concrete Factories**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/StudentFactory.java`
       - Package: `team4.quizify.patterns.factory.StudentFactory`
       - Purpose: Creates student users with student-specific initialization.
     
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/TeacherFactory.java`
       - Package: `team4.quizify.patterns.factory.TeacherFactory`
       - Purpose: Creates teacher users with teacher-specific initialization.
   
   - **Factory Producer**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/UserFactoryProducer.java`
     - Package: `team4.quizify.patterns.factory.UserFactoryProducer`
     - Purpose: Provides the appropriate factory implementation based on user role.

2. **Report Factory Pattern**
   
   - **Factory Interface**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/ReportFactory.java`
     - Package: `team4.quizify.patterns.factory.ReportFactory`
     - Purpose: Defines the contract for creating report objects.

   - **Concrete Factories**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/StudentReportFactory.java`
       - Package: `team4.quizify.patterns.factory.StudentReportFactory`
       - Purpose: Creates student-specific reports.
     
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/TeacherReportFactory.java`
       - Package: `team4.quizify.patterns.factory.TeacherReportFactory`
       - Purpose: Creates teacher-specific reports.

        - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/AdminReportFactory.java`
       - Package: `team4.quizify.patterns.factory.AdminReportFactory`
       - Purpose: Creates admin-specific reports.
   
   - **Factory Producer**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/ReportFactoryProducer.java`
     - Package: `team4.quizify.patterns.factory.ReportFactoryProducer`
     - Purpose: Provides the appropriate report factory based on user role.

3. **Quiz Factory Pattern**
   
   - **Factory Interface**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/QuizFactory.java`
     - Package: `team4.quizify.patterns.factory.QuizFactory`
     - Purpose: Defines the contract for creating quiz objects.

      - **Concrete Factories**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/AutoQuizFactory.java`
       - Package: `team4.quizify.patterns.factory.AutoQuizFactory`
       - Purpose: Creates student-specific reports.
     
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/ManualQuizFactory.java`
       - Package: `team4.quizify.patterns.factory.ManualQuizFactory`
       - Purpose: Creates teacher-specific reports.

        - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/PracticeQuizFactory.java`
       - Package: `team4.quizify.patterns.factory.PracticeQuizFactory`
       - Purpose: Creates admin-specific reports.

   - **Factory Producer**:
     - File Path: `Backend/src/main/java/team4/quizify/patterns/factory/QuizFactoryProducer.java`
     - Package: `team4.quizify.patterns.factory.QuizFactoryProducer`
     - Purpose: Provides the appropriate quiz factory based on quiz type.

#### Implementation Examples:

**User Factory Interface:**

```java
// File: Backend/src/main/java/team4/quizify/patterns/factory/UserFactory.java
package team4.quizify.patterns.factory;

import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;

public interface UserFactory {
    User createUser(String fname, String lname, String username, String password, 
                   String email, MultipartFile profileImage);
}
```

**Student Factory Implementation:**

```java
// File: Backend/src/main/java/team4/quizify/patterns/factory/StudentFactory.java
package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;
import team4.quizify.entity.Student;
import team4.quizify.patterns.adapter.StorageManager;
import team4.quizify.repository.StudentRepository;
import team4.quizify.service.UserService;

@Component
public class StudentFactory implements UserFactory {

    @Autowired
    private UserService userService;
    
    @Autowired
    private StorageManager storageManager;
    
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public User createUser(String fname, String lname, String username, String password, 
                          String email, MultipartFile profileImage) {
        // Validation logic
        
        // Upload profile image if provided
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = storageManager.uploadFile(profileImage);
        }
        
        // Create the user with role Student
        User user = new User(fname, lname, username, password, email, "Student", profileImageUrl);
        User savedUser = userService.saveUser(user);
        
        // Create and associate student record
        Student student = new Student();
        student.setUser(savedUser);
        student.setEnrolledSubjects(new Integer[0]);
        student.setAttemptedQuiz(new Integer[0]);
        studentRepository.save(student);
        
        return savedUser;
    }
}
```

**Factory Producer:**

```java
// File: Backend/src/main/java/team4/quizify/patterns/factory/UserFactoryProducer.java
package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserFactoryProducer {
    
    @Autowired
    private StudentFactory studentFactory;
    
    @Autowired
    private TeacherFactory teacherFactory;
    
    public UserFactory getFactory(String userRole) {
        if (userRole == null) {
            return null;
        }
        
        if (userRole.equalsIgnoreCase("Student")) {
            return studentFactory;
        } else if (userRole.equalsIgnoreCase("Teacher")) {
            return teacherFactory;
        }
        
        return null;
    }
}
```

## API Flow and Pattern Usage

This section outlines how the design patterns are applied in various APIs throughout the Quizify application.

### User Management APIs

#### 1. Add User API
- **Endpoint**: `POST /Quizify/admin/user`
- **Controller File**: `Backend/src/main/java/team4/quizify/controller/AdminController.java`
- **Method**: `AdminController.addUser()`
- **Flow**:
  1. AdminController receives request with user details.
  2. Controller gets the AdminServiceSingleton instance (Singleton Pattern).
  3. Based on the role:
     - For "Student": Uses StudentCreationTemplate.createUser() (Template Method Pattern)
     - For "Teacher": Uses TeacherCreationTemplate.createUser() (Template Method Pattern)
     - For other roles: Uses AdminService directly
  4. Inside the template methods:
     - User data is validated
     - Profile image is processed using StorageManager (Adapter Pattern)
     - Base user is created
     - Role-specific user is created
  5. The created user is returned in the response.

```java
// File: Backend/src/main/java/team4/quizify/controller/AdminController.java
@PostMapping("/user")
public ResponseEntity<?> addUser(
        @RequestParam String fname,
        @RequestParam String lname,
        @RequestParam String username,
        @RequestParam String password,
        @RequestParam String email,
        @RequestParam String role,
        @RequestParam(required = false) MultipartFile profileImage) {
    try {
        // Get the AdminService singleton instance
        AdminServiceSingleton adminServiceSingleton = AdminServiceSingleton.getInstance(applicationContext);
        AdminService adminService = adminServiceSingleton.getAdminService();
        
        User user;
        
        // Use Template Method pattern based on role
        if ("Student".equals(role)) {
            user = studentCreationTemplate.createUser(fname, lname, username, password, email, role, profileImage);
        } else if ("Teacher".equals(role)) {
            user = teacherCreationTemplate.createUser(fname, lname, username, password, email, role, profileImage);
        } else {
            // For other roles, use AdminService directly
            // Process profile image using Adapter pattern
            String profileImageUrl = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                profileImageUrl = storageManager.uploadFile(profileImage);
            }
            
            user = adminService.createUser(fname, lname, username, password, email, role, profileImageUrl);
        }
        return ResponseEntity.ok(user);
    } catch (Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
```