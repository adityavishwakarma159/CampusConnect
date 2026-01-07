# Quick Start Guide - Campus Connect Backend

## Prerequisites Check

Before running the backend, you need:
1. ✅ Java JDK 17 or higher installed
2. ✅ JAVA_HOME environment variable set
3. ✅ MySQL 8.0+ installed and running

---

## Step 1: Set JAVA_HOME (Windows)

### Option A: Set for Current PowerShell Session (Temporary)
```powershell
# Replace with your actual Java installation path
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Option B: Set Permanently (Recommended)
1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Under **System Variables**, click **New**
3. Variable name: `JAVA_HOME`
4. Variable value: `C:\Program Files\Java\jdk-17` (or your Java installation path)
5. Click **OK**
6. Find **Path** variable, click **Edit**, add `%JAVA_HOME%\bin`
7. Restart PowerShell

### Verify Java Installation
```powershell
java -version
# Should show: java version "17.x.x" or higher
```

---

## Step 2: Setup MySQL Database

```sql
# Start MySQL and login
mysql -u root -p

# Create database
CREATE DATABASE campus_connect;

# Use database
USE campus_connect;

# Run schema script
SOURCE d:/Demo/database/schema.sql;

# Verify tables created
SHOW TABLES;
# Should show: departments, users, refresh_tokens, password_reset_requests

# Exit MySQL
EXIT;
```

---

## Step 3: Update Database Password

The `application.properties` file is already configured with your password: `admin`

If you need to change it, edit: `d:\Demo\backend\src\main\resources\application.properties`

---

## Step 4: Build and Run Backend

```powershell
# Navigate to backend directory
cd d:\Demo\backend

# Clean and install dependencies (first time only)
.\mvnw.cmd clean install

# Run the application
.\mvnw.cmd spring-boot:run
```

**Expected Output:**
```
========================================
Campus Connect Backend Started Successfully!
Server running on: http://localhost:8080
========================================
Initial admin account created: admin@campus.com
```

---

## Step 5: Test Backend API

Open a new PowerShell window and test the login endpoint:

```powershell
# Test login API
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@campus.com\",\"password\":\"Admin@123\"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@campus.com",
    "name": "System Administrator",
    "role": "ADMIN"
  },
  "isFirstLogin": false
}
```

---

## Troubleshooting

### Error: "JAVA_HOME not found"
**Solution:** Follow Step 1 to set JAVA_HOME

### Error: "java: error: invalid target release: 17"
**Solution:** You need JDK 17 or higher. Download from: https://adoptium.net/

### Error: "Access denied for user 'root'@'localhost'"
**Solution:** Check MySQL password in `application.properties` matches your MySQL root password

### Error: "Unknown database 'campus_connect'"
**Solution:** Run the SQL commands in Step 2 to create the database

### Error: "Port 8080 already in use"
**Solution:** Stop the process using port 8080 or change port in `application.properties`:
```properties
server.port=8081
```

---

## Next Steps

Once backend is running:
1. Keep the backend running in this terminal
2. Open a new terminal for the frontend
3. Follow frontend setup instructions in `SETUP_GUIDE.md`

---

## Quick Commands Reference

```powershell
# Build project
.\mvnw.cmd clean install

# Run application
.\mvnw.cmd spring-boot:run

# Run with specific profile
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev

# Skip tests
.\mvnw.cmd clean install -DskipTests

# Check Java version
java -version

# Check Maven wrapper version
.\mvnw.cmd -version
```
