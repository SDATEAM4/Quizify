# Quizify Setup Guide
This guide provides detailed instructions for setting up and running the Quizify application in Visual Studio Code. Quizify is a comprehensive quiz management system built with Spring Boot (backend) and React (frontend).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Required VS Code Extensions](#required-vs-code-extensions)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

1. **Java Development Kit (JDK) 21**
   - Quizify requires JDK 21 as specified in the pom.xml
   - Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java21) or use OpenJDK
   - Set JAVA_HOME environment variable to point to your JDK installation

2. **Node.js and npm**
   - Required for the React frontend
   - Download from [Node.js website](https://nodejs.org/)
   - Recommended version: Node.js 18.x or newer

3. **PostgreSQL (Neon)**
   - The application is configured to use Neon PostgreSQL, a serverless PostgreSQL database service
   - No local PostgreSQL installation is required as the application connects to Neon's cloud service
   - Connection details are already configured in `application.properties`
   - You can sign up for your own Neon account at [Neon Website](https://neon.tech/) if you need to use your own database

4. **Visual Studio Code**
   - Download from [VS Code website](https://code.visualstudio.com/)

## Required VS Code Extensions

Install the following extensions to enhance your development experience:

### Java Development Extensions (Optional)
- **Extension Pack for Java** (`vscjava.vscode-java-pack`)
- **Spring Boot Tools** (`vmware.vscode-spring-boot`)
- **Spring Initializr** (`vscjava.vscode-spring-initializr`)
- **Maven for Java** (`vscjava.vscode-maven`)
- **Debugger for Java** (`vscjava.vscode-java-debug`)

### Database Tools (Optional)
- **SQLTools** (`mtxr.sqltools`)
- **SQLTools PostgreSQL Driver** (`mtxr.sqltools-driver-pg`)

### Frontend Development (Optional)
- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Tailwind Documentation** (`austenc.tailwind-docs`)
- **PostCSS Language Support** (`csstools.postcss`)

### General Development (Optional)
- **Code Runner** (`formulahendry.code-runner`)
- **REST Client** (`humao.rest-client`)


4. **External Services Configuration**
   - The application is pre-configured to use the following external services:
   
   a. **Neon PostgreSQL Database**
   ```properties
   spring.datasource.url=jdbc:postgresql://ep-dry-tree-a4q742kj-pooler.us-east-1.aws.neon.tech/neondb
   spring.datasource.username=neondb_owner
   spring.datasource.password=npg_rWkuY9JDzUK2
   ```
   
   b. **Cloudinary for Image Storage**
   ```properties
   cloudinary.cloud-name=dgepdaeg7
   cloudinary.api-key=347561826927389
   cloudinary.api-secret=EPFRT3gMwgiMHe6qKSiaPetZzoA
   ```
   
   c. **OpenRouter APIs for AI Features**
   ```properties
   openrouter.api.key=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
   openhands.api.key=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
   dolphin.api.key=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
   nvidia.api.key=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
   ```
   
   d. **Gmail for OTP Verification**
   ```properties
   spring.mail.username=quizify.help@gmail.com
   spring.mail.password=cfgdcgyphqmuvjvc
   ```
     - All of these services are already configured in `application.properties`
   - If you wish to use your own services, create your accounts on these platforms and update the credentials in the properties file

5. **Configure Java in VS Code**
   - Ensure VS Code recognizes your JDK 21 installation
   - Open Command Palette (Ctrl+Shift+P) and run "Java: Configure Java Runtime"
   - Set JDK 21 as the default Java runtime

## Running the Application

## Backend Setup

1. **Clone the repository** (if you haven't already)
```bash or cmd
git clone https://github.com/SDATEAM4/Quizify.git
```
Or copy from Project CD
```
cd Quizify/Phase 3/Quizify/
```

2. **Install Maven Dependencies**
   - In VS Code, open the terminal and navigate to the Backend directory:
   ```bash or cmd
   cd Backend
   ```
   
   - For Windows (PowerShell):
   ```cmd or bash
   # Install dependencies
   ./mvnw clean install
   ```
   
   - For Windows (Command Prompt):
   ```cmd
   mvnw clean install
   ```
   
   - For Mac/Linux:
   ```bash
   ./mvnw clean install
   ```

3. **Start the Spring Boot application**
   - In VS Code, open the terminal in the Backend directory
   
   - For Windows (PowerShell):
   ```powershell
   .\mvnw spring-boot:run
   ```
   
   - For Windows (Command Prompt):
   ```cmd
   mvnw spring-boot:run
   ```
   
   - For Mac/Linux:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   - Alternatively, run it directly through VS Code:
     - Open `Backend/src/main/java/team4/quizify/QuizifyApplication.java`
     - Click the "Run" button above the `main` method

2. **Verify backend is running**
   - The application should start on port 8080 (default Spring Boot port)
   - You should see Spring Boot startup logs in the terminal
   - Access `http://localhost:8080` in your browser to check if the backend is running

## Frontend Setup

1. **Navigate to the frontend directory**
   - In a new terminal, navigate to the frontend directory:
   ```bash or cmd
   cd frontend
   ```

2. **Install dependencies**
   ```bash or cmd
   npm install
   ```

3. **Start the React development server**
   ```bash or cmd
   npm run dev
   ```

2. **Access the application**
   - The React app will be available at `http://localhost:5173` (default Vite port)
   - Open this URL in your browser to access the Quizify application

## Troubleshooting

### Java Issues
- **Java version mismatch**: Ensure you're using JDK 21 as specified in the pom.xml
- **JAVA_HOME not set**: Make sure your JAVA_HOME environment variable points to JDK 21
- **Maven build fails**: Check that you have Maven installed or use the provided Maven wrapper (`mvnw`)

### Database Issues
- **Connection to Neon refused**: 
  - Verify your internet connection is working 
  - Check if Neon's service is operational at [Neon Status](https://neon.tech/status)
  - The application is configured to use a pooled connection to improve reliability
- **Authentication failed**: 
  - Check if the Neon credentials in application.properties are still valid
  - The Neon credentials are already configured, but if needed, you can create your own database on Neon
- **Schema issues**: The application uses Hibernate's `ddl-auto=update`, which automatically creates and updates tables

### Frontend Issues
- **Node modules not found**: Run `npm install` in the frontend directory
- **API endpoint issues**: Ensure the backend is running and the API endpoint is correctly configured in the frontend
- **Vite build errors**: Check for compatibility issues with your Node.js version

### Port Conflicts
- **Port 8080 already in use**: Change the backend port in application.properties:
  ```properties
  server.port=8081
  ```
- **Port 5173 already in use**: Vite will automatically try the next available port

### External Services Issues

- **Cloudinary Issues**:
  - If image uploads fail, verify the Cloudinary credentials in application.properties
  - Check your Cloudinary account status and limits at [Cloudinary Console](https://console.cloudinary.com/)
  - Ensure your network allows connections to Cloudinary's services

- **OpenRouter API Issues**:
  - If AI-powered features fail, check the OpenRouter API keys in application.properties
  - Verify your OpenRouter account has sufficient credits at [OpenRouter Dashboard](https://openrouter.ai/dashboard)
  - The application uses multiple API keys for different AI models to improve reliability

- **Email/OTP Issues**:
  - If email verification fails, check the Gmail SMTP credentials in application.properties
  - Ensure your Gmail account has "Less secure app access" enabled or is using an App Password
  - Check if your Gmail account has reached sending limits

If you encounter any other issues, check the application logs for specific error messages and consult the project documentation or reach out to the development team.
