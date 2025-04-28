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

## Design Patterns

### Singleton Pattern

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. This pattern is useful when we need exactly one object to coordinate actions across the system.

#### Implementation in Quizify:

The Singleton pattern is implemented for the following services:

1. **AdminServiceSingleton**
   - Location: `team4.quizify.patterns.singleton.AdminServiceSingleton`
   - Purpose: Ensures that only one instance of AdminService exists throughout the application.
   - Usage: Used in AdminController to manage user creation and other admin operations.

2. **CloudinaryServiceSingleton**
   - Location: `team4.quizify.patterns.singleton.CloudinaryServiceSingleton`
   - Purpose: Provides a single instance for Cloudinary service operations.
   - Usage: Used for file upload operations.

3. **AuthServiceSingleton**
   - Location: `team4.quizify.patterns.singleton.AuthServiceSingleton`
   - Purpose: Ensures a single instance for authentication operations.
   - Usage: Used for user authentication processes.

#### Implementation Example:

```java
@Component
public class AdminServiceSingleton {
    private static AdminServiceSingleton instance;
    private final AdminService adminService;
    
    @Autowired
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

The Template Method pattern is implemented for user creation:

1. **UserCreationTemplate**
   - Location: `team4.quizify.patterns.template.UserCreationTemplate`
   - Purpose: Defines the sequence of steps for creating a user.
   - Abstract methods:
     - `validateUserData`: Validates username and email uniqueness
     - `processProfileImage`: Handles profile image upload
     - `createBaseUser`: Creates the base user object
     - `createRoleSpecificUser`: Role-specific user creation logic

2. **Concrete implementations**:
   - `StudentCreationTemplate`: Implements user creation specific to students.
   - `TeacherCreationTemplate`: Implements user creation specific to teachers.

#### Implementation Example:

```java
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

### Adapter Pattern

The Adapter pattern converts the interface of a class into another interface that clients expect. It enables classes to work together that couldn't otherwise due to incompatible interfaces.

#### Implementation in Quizify:

1. **StorageService Interface**
   - Location: `team4.quizify.patterns.adapter.StorageService`
   - Purpose: Defines common storage operations for file management.
   - Methods:
     - `uploadFile`: Uploads a file to storage
     - `deleteFile`: Deletes a file from storage

2. **Adapters**:
   - `CloudinaryStorageAdapter`: Adapts the CloudinaryService to the StorageService interface.
   - `LocalStorageService`: Implements the StorageService interface for local file system storage.

3. **StorageManager**:
   - Location: `team4.quizify.patterns.adapter.StorageManager`
   - Purpose: Selects the appropriate storage adapter based on configuration.
   - Usage: Centralizes file storage operations across the application.

#### Implementation Example:

```java
@Service
public class StorageManager {
    @Value("${storage.type:cloudinary}")
    private String storageType;
    
    @Autowired
    private CloudinaryStorageAdapter cloudinaryStorageAdapter;
    
    @Autowired
    private LocalStorageService localStorageService;
    
    public StorageService getStorageService() {
        if ("local".equalsIgnoreCase(storageType)) {
            return localStorageService;
        } else {
            return cloudinaryStorageAdapter;
        }
    }
    
    public String uploadFile(MultipartFile file) {
        return getStorageService().uploadFile(file);
    }
    
    public boolean deleteFile(String fileIdentifier) {
        return getStorageService().deleteFile(fileIdentifier);
    }
}
```

### Factory Pattern

The Factory pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

#### Implementation in Quizify:

1. **UserFactory Interface**
   - Location: `team4.quizify.patterns.factory.UserFactory`
   - Purpose: Defines the contract for creating user objects.
   - Method: `createUser`: Creates a user with specified attributes.

2. **Concrete Factories**:
   - `StudentFactory`: Creates student users.
   - `TeacherFactory`: Creates teacher users.

#### Implementation Example:

```java
public interface UserFactory {
    User createUser(String fname, String lname, String username, String password, 
                   String email, MultipartFile profileImage);
}
```

## API Flow and Pattern Usage

### User Management APIs

#### 1. Add User API
- **Endpoint**: `POST /Quizify/admin/user`
- **Controller**: `AdminController.addUser()`
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
            // For other roles (like Admin), use the original method
            user = adminService.addUser(fname, lname, username, password, email, role, profileImage);
        }
        
        return ResponseEntity.ok(user);
    } catch (Exception e) {
        // Error handling...
    }
}
```

#### 2. Get All Users API
- **Endpoint**: `GET /Quizify/admin/users`
- **Controller**: `AdminController.getAllUsers()`
- **Flow**:
  1. Controller gets the AdminServiceSingleton instance (Singleton Pattern).
  2. AdminService is used to fetch all users.
  3. The list of users is returned in the response.

#### 3. Get User By ID API
- **Endpoint**: `GET /Quizify/admin/user/{userId}`
- **Controller**: `AdminController.getUserById()`
- **Flow**:
  1. Controller receives the user ID.
  2. UserService is used to fetch the user.
  3. Additional information is fetched based on the user role.
  4. The user data with role-specific information is returned in the response.

### Authentication APIs

Authentication flows use the AuthServiceSingleton to maintain a single point for authentication operations.

#### Login API
- When a user logs in, the AuthServiceSingleton is used to authenticate credentials and generate session tokens.

### Quiz Management APIs

Quiz management would likely use the same patterns for consistency:
- Singleton Pattern for service access
- Template Method for structured quiz operations
- Adapter Pattern for file uploads (e.g., images in quizzes)

## Conclusion

This design patterns implementation in Quizify ensures:
1. **Singleton Pattern**: Consistent access to services with a single instance
2. **Template Method Pattern**: Structured and reusable user creation process
3. **Adapter Pattern**: Flexible file storage options without changing client code
4. **Factory Pattern**: Standardized creation process for different user types

These patterns help maintain a clean, maintainable, and extensible codebase while providing a consistent API experience.
