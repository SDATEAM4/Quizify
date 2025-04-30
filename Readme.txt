# QUIZIFY APPLICATION README

======================================================================
                         SETUP GUIDE
======================================================================

## PREREQUISITES

Before starting, ensure you have the following installed:

1. Java Development Kit (JDK) 21
   - Required as specified in pom.xml
   - Download from Oracle JDK or use OpenJDK
   - Set JAVA_HOME environment variable 

2. Node.js and npm
   - Required for React frontend
   - Recommended version: Node.js 18.x or newer

3. PostgreSQL (Neon)
   - The application uses Neon PostgreSQL cloud service
   - Connection details are configured in application.properties

4. Visual Studio Code
   - Recommended IDE for development

## REQUIRED VS CODE EXTENSIONS

### Java Development Extensions
- Extension Pack for Java
- Spring Boot Tools
- Spring Initializr
- Maven for Java
- Debugger for Java

### Frontend Development
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Tailwind Documentation
- PostCSS Language Support

## EXTERNAL SERVICES CONFIGURATION

The application is pre-configured to use:

1. Neon PostgreSQL Database
   spring.datasource.url=jdbc:postgresql://ep-dry-tree-a4q742kj-pooler.us-east-1.aws.neon.tech/neondb
   spring.datasource.username=neondb_owner
   spring.datasource.password=npg_rWkuY9JDzUK2

2. Cloudinary for Image Storage
   cloudinary.cloud-name=dgepdaeg7
   cloudinary.api-key=347561826927389
   cloudinary.api-secret=EPFRT3gMwgiMHe6qKSiaPetZzoA

3. OpenRouter APIs for AI Features
   openrouter.api.key=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
   openhands.api.key=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
   dolphin.api.key=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
   nvidia.api.key=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

4. Gmail for OTP Verification
   spring.mail.username=quizify.help@gmail.com
   spring.mail.password=cfgdcgyphqmuvjvc

## RUNNING THE APPLICATION
-- Copy project from CD.
cd Quizify/Phase 3/Quizify/
### Backend Setup

1. Navigate to Backend directory:
   cd Backend

2. Install Maven Dependencies:
   For Windows (PowerShell):
   .\mvnw clean install

    For Windows (Bash or cmd):
   ./mvnw clean install
   
   For Mac/Linux:
   ./mvnw clean install

3. Start the Spring Boot application:
   For Windows (PowerShell):
   .\mvnw spring-boot:run

   For Windows (Bash or cmd):
   ./mvnw spring-boot:run

   For Mac/Linux:
   ./mvnw spring-boot:run

4. Verify backend is running at http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the React development server:
   npm run dev

4. Access the application at http://localhost:5173

## TROUBLESHOOTING

- Java version mismatch: Ensure you're using JDK 21
- Database connection refused: Verify internet connection and Neon service status
- Node modules not found: Run npm install in frontend directory
- Port conflicts: Change ports in configuration if needed
- External services issues: Verify credentials and service status

======================================================================
                    DESIGN PATTERNS IMPLEMENTED
======================================================================

# QUIZIFY APPLICATION DESIGN PATTERNS

The Quizify application implements the following design patterns:

## 1. SINGLETON PATTERN

Ensures a class has only one instance with global access point.

Implemented in:
- AdminServiceSingleton
- CloudinaryServiceSingleton
- AuthServiceSingleton
- OpenRouterServiceSingleton

## 2. TEMPLATE METHOD PATTERN

Defines algorithm skeleton in superclass but lets subclasses override specific steps.

Implemented for:
- User Creation Template
  - StudentCreationTemplate
  - TeacherCreationTemplate
- Quiz Generation Template
  - AutoQuizGenerationTemplate
  - ManualQuizGenerationTemplate
  - PracticeQuizGenerationTemplate

## 3. ADAPTER PATTERN

Converts interface of a class into another interface clients expect.

Components:
- Target Interface: StorageService
- Adapter: CloudinaryStorageAdapter
- Adaptee: CloudinaryService
- Client: StorageManager

## 4. FACTORY PATTERN

Provides interface for creating objects in superclass but allows subclasses to alter object types.

Implemented for:
- User Factory Pattern
  - StudentFactory
  - TeacherFactory
- Report Factory Pattern
  - StudentReportFactory
  - TeacherReportFactory
  - AdminReportFactory
- Quiz Factory Pattern
  - AutoQuizFactory
  - ManualQuizFactory
  - PracticeQuizFactory

## API FLOW EXAMPLES

### User Management APIs - Add User API Flow:
1. AdminController receives user details
2. Gets AdminServiceSingleton instance (Singleton Pattern)
3. Uses appropriate CreationTemplate based on role (Template Method)
4. Profile image processed with StorageManager (Adapter Pattern)
5. User is created and returned in response

For full documentation, refer to DESIGN_PATTERNS.md and RUN.md