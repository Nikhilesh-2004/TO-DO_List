# Todo App

A full-stack todo application with user authentication, built using Spring Boot for the backend and React for the frontend.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Secure API endpoints with Spring Security
- Responsive React frontend
- MySQL database integration

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.4
- Spring Security
- JWT (JSON Web Tokens)
- JPA/Hibernate
- MySQL
- Maven

### Frontend
- React 18
- Vite
- Axios for API calls
- React Router
- CSS for styling

### Database
- MySQL

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### Database Setup

1. Install MySQL and create a database named `todoapp`
2. Run the schema script:
   ```sql
   -- Execute the contents of database/schema.sql in your MySQL client
   ```

3. Update `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/todoapp
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and compile:
   ```bash
   mvn clean compile
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Tasks (requires authentication)
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Usage

1. Start the backend server
2. Start the frontend development server
3. Open `http://localhost:5173` in your browser
4. Register a new account or login
5. Create and manage your todo tasks

## Project Structure

```
todo-app/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/todoapp/
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # JPA repositories
│   │   └── security/       # Security configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── services/       # API services
│   ├── public/
│   └── package.json
├── database/
│   └── schema.sql          # Database schema
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.