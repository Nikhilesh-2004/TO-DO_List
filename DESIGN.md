# Todo App Design Documentation

## Overview

The Todo App is a full-stack web application that allows users to manage their personal todo tasks with secure authentication. The application consists of a Spring Boot backend providing RESTful APIs and a React frontend for user interaction.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React Frontend│◄────────────────►│ Spring Boot API │
│   (Vite)        │                  │   (Backend)     │
└─────────────────┘                  └─────────────────┘
                                           │
                                           │ JDBC
                                           ▼
                                   ┌─────────────────┐
                                   │   MySQL Database│
                                   │                 │
                                   └─────────────────┘
```

### Component Breakdown

#### Frontend (React + Vite)
- **Purpose**: User interface and client-side logic
- **Technologies**: React 18, Vite, Axios, React Router
- **Responsibilities**:
  - User authentication (login/signup)
  - Task management UI
  - API communication
  - State management with React Context

#### Backend (Spring Boot)
- **Purpose**: Business logic, data persistence, and API endpoints
- **Technologies**: Spring Boot, Spring Security, JWT, JPA/Hibernate
- **Responsibilities**:
  - User authentication and authorization
  - Task CRUD operations
  - Data validation
  - Security enforcement

#### Database (MySQL)
- **Purpose**: Persistent data storage
- **Tables**: users, tasks
- **Relationships**: One-to-many (User → Tasks)

## Database Design

### Entity-Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User     │       │    Task     │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │
│ username    │       │ title       │
│ email       │       │ description │
│ password    │       │ status      │
│ created_at  │       │ user_id (FK)│
└─────────────┘       │ created_at  │
                      │ updated_at  │
                      └─────────────┘
```

### Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Design

### Authentication Endpoints

#### POST /api/auth/signup
**Purpose**: Register a new user
**Request Body**:
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```
**Response**: Success message or error

#### POST /api/auth/signin
**Purpose**: Authenticate user and return JWT token
**Request Body**:
```json
{
    "username": "string",
    "password": "string"
}
```
**Response**:
```json
{
    "id": "number",
    "username": "string",
    "email": "string",
    "accessToken": "string",
    "tokenType": "Bearer"
}
```

### Task Management Endpoints

All task endpoints require JWT authentication in the Authorization header.

#### GET /api/tasks
**Purpose**: Retrieve all tasks for the authenticated user
**Response**: Array of TaskDTO objects

#### POST /api/tasks
**Purpose**: Create a new task
**Request Body**:
```json
{
    "title": "string",
    "description": "string"
}
```
**Response**: Success message

#### PUT /api/tasks/{id}
**Purpose**: Update an existing task
**Request Body**:
```json
{
    "title": "string",
    "description": "string",
    "status": "PENDING|COMPLETED"
}
```
**Response**: Success message

#### DELETE /api/tasks/{id}
**Purpose**: Delete a task
**Response**: Success message

## Security Design

### Authentication Flow

1. User submits login credentials
2. Backend validates credentials against database
3. If valid, generates JWT token with user details
4. Token returned to client and stored in localStorage
5. Subsequent requests include token in Authorization header
6. Backend validates token on protected endpoints

### Authorization

- JWT tokens contain user ID and username
- Tasks are scoped to the authenticated user
- All task operations check user ownership

### Password Security

- Passwords are hashed using BCrypt
- No plain-text password storage

### CORS Configuration

- Frontend origin allowed for API access
- Credentials enabled for cookie/token handling

## Frontend Design

### Component Structure

```
App.jsx
├── Login.jsx
├── Signup.jsx
└── Dashboard.jsx
    ├── TaskList.jsx
    ├── TaskItem.jsx
    └── TaskForm.jsx
```

### State Management

- **AuthContext**: Manages authentication state and user data
- **Local State**: Component-level state for forms and UI interactions

### Routing

- `/`: Redirects to login or dashboard based on auth status
- `/login`: Login form
- `/signup`: Registration form
- `/dashboard`: Main task management interface

## Data Flow

### User Registration/Login

1. User fills form and submits
2. Frontend sends request to auth endpoint
3. Backend validates and returns JWT token
4. Frontend stores token and redirects to dashboard

### Task Operations

1. User performs action (create/update/delete task)
2. Frontend sends authenticated request to task endpoint
3. Backend validates token and user permissions
4. Database operation performed
5. Frontend updates UI based on response

## Error Handling

### Backend
- Validation errors return 400 Bad Request with field-specific messages
- Authentication errors return 401 Unauthorized
- Authorization errors return 403 Forbidden
- Not found errors return 404 Not Found
- Server errors return 500 Internal Server Error

### Frontend
- API errors displayed to user via alerts/notifications
- Form validation prevents invalid submissions
- Network errors handled gracefully

## Performance Considerations

- Database indexes on frequently queried fields (user_id, email)
- Lazy loading for related entities
- Efficient queries using JPA specifications
- Frontend API calls optimized with Axios interceptors

## Scalability

- Stateless backend design allows horizontal scaling
- Database connection pooling
- JWT tokens enable distributed session management
- RESTful API design supports API versioning

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Nginx/Apache  │    │   Spring Boot   │
│   (Reverse Proxy)│◄──►│   Application  │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
                      ┌─────────────────┐
                      │   MySQL Server  │
                      └─────────────────┘
```

## Testing Strategy

### Unit Tests
- Service layer business logic
- Utility functions (JWT utils, password encoding)

### Integration Tests
- Repository layer with test database
- Controller endpoints with mock MVC

### End-to-End Tests
- Frontend user flows with Cypress
- API testing with Postman/Newman

## Monitoring and Logging

- Spring Boot Actuator for health checks and metrics
- Structured logging with SLF4J
- Error tracking and alerting
- Database query performance monitoring