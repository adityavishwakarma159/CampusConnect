# Campus Connect - Sprint 1 Setup Guide

## Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v16 or higher with npm
- **MySQL**: 8.0 or higher
- **IDE**: IntelliJ IDEA / VS Code

## Backend Setup

### 1. Database Setup

```sql
# Start MySQL server and create database
mysql -u root -p

CREATE DATABASE campus_connect;
USE campus_connect;
SOURCE d:/Demo/database/schema.sql;
```

### 2. Configure Application Properties

Edit `backend/src/main/resources/application.properties`:

```properties
# Update these values according to your MySQL setup
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# Email configuration (optional for Sprint 1)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Install Dependencies and Run

```bash
cd d:/Demo/backend
mvn clean install
mvn spring-boot:run
```

**Expected Output:**
- Server starts on `http://localhost:8080`
- Initial admin account created: `admin@campus.com` / `Admin@123`

## Frontend Setup

### 1. Install Dependencies

```bash
cd d:/Demo/CampusConnect
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

**Expected Output:**
- Frontend starts on `http://localhost:5173` (or similar)

## Testing the Application

### 1. Login Test

1. Open browser and navigate to `http://localhost:5173`
2. You should see the login page
3. Enter credentials:
   - Email: `admin@campus.com`
   - Password: `Admin@123`
4. Click "Sign in"
5. You should be redirected to the Admin Dashboard

### 2. Token Refresh Test

1. After logging in, wait for 15+ minutes (or modify JWT expiration in `application.properties` for faster testing)
2. Perform any action (e.g., refresh the page)
3. The access token should automatically refresh in the background
4. You should remain logged in

### 3. Protected Routes Test

1. While logged in as admin, try to access:
   - `http://localhost:5173/faculty/dashboard` → Should redirect to Unauthorized page
   - `http://localhost:5173/student/dashboard` → Should redirect to Unauthorized page
2. Logout
3. Try to access `http://localhost:5173/admin/dashboard` → Should redirect to Login page

### 4. Logout Test

1. Login successfully
2. Click the "Logout" button in the header
3. You should be redirected to the login page
4. Tokens should be cleared from localStorage
5. Try to access any protected route → Should redirect to login

## API Endpoints

### Authentication APIs

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/refresh` - Refresh access token
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/me` - Get current user details
- **POST** `/api/auth/first-time-setup` - Set password on first login
- **POST** `/api/auth/request-password-reset` - Request password reset

### Testing with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campus.com","password":"Admin@123"}'

# Get current user (replace <TOKEN> with access token from login response)
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Default Credentials

- **Admin**: `admin@campus.com` / `Admin@123`

## Troubleshooting

### Backend Issues

**Issue**: Database connection error
- **Solution**: Check MySQL is running and credentials in `application.properties` are correct

**Issue**: Port 8080 already in use
- **Solution**: Change port in `application.properties`: `server.port=8081`

### Frontend Issues

**Issue**: `npm install` fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Issue**: API calls fail with CORS error
- **Solution**: Ensure backend is running and CORS is configured correctly in `SecurityConfig.java`

**Issue**: Tailwind CSS not working
- **Solution**: Run `npm run dev` to start Vite dev server which processes Tailwind

## Project Structure

```
campus-connect/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/campus/
│   │   ├── config/            # Security, CORS configuration
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── exception/         # Exception handling
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # JPA Repositories
│   │   ├── security/          # JWT components
│   │   └── service/           # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── CampusConnect/             # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── utils/             # Utilities (axios, constants)
│   └── package.json
│
└── database/
    └── schema.sql             # Database schema
```

## Next Steps

Sprint 1 is complete! The following features are ready:
- ✅ JWT-based authentication
- ✅ Login/Logout functionality
- ✅ Token refresh mechanism
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Basic dashboards for all roles

**Sprint 2** will implement:
- User management (CRUD operations)
- Bulk user upload via Excel
- Password reset approval workflow
- Department management
