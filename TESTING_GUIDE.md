# Campus Connect - Sprint 2 Testing Guide

## Quick Start

### 1. Start the Application

**Backend:**
```powershell
cd d:\Demo\backend
.\mvnw.cmd spring-boot:run
```

**Frontend:**
```powershell
cd d:\Demo\CampusConnect
npm run dev
```

### 2. Login
- URL: http://localhost:5173
- Email: `admin@campus.com`
- Password: `Admin@123`

---

## Feature Testing Checklist

### ✅ User Management

**Test Manual User Creation:**
1. Click "User Management" from dashboard
2. Click "Add User" button
3. Fill form:
   - Name: John Doe
   - Email: john.doe@test.com
   - Role: Student
   - Department: Computer Science
   - Roll Number: CS2024001
   - Joining Year: 2024
4. Click "Create User"
5. ✅ User appears in table
6. ✅ Check console for invitation email log

**Test Search:**
1. Type "john" in search box
2. ✅ Only matching users shown

**Test Filters:**
1. Select "STUDENT" from role filter
2. ✅ Only students shown
3. Select department from dropdown
4. ✅ Only users from that department shown

**Test Delete:**
1. Click trash icon on a user
2. Confirm deletion
3. ✅ User marked inactive

---

### ✅ Bulk Upload

**Test Student Upload:**
1. Navigate to "Bulk Upload"
2. Select "Student" type
3. Use template at `d:\Demo\templates\student_template.csv`
4. Upload file
5. ✅ Success count shown
6. ✅ Users created and visible in User Management

**Test Faculty Upload:**
1. Select "Faculty" type
2. Use template at `d:\Demo\templates\faculty_template.csv`
3. Upload file
4. ✅ Faculty members created

**Test Error Handling:**
1. Create Excel with invalid data:
   - Invalid email: `notanemail`
   - Invalid department: `INVALID`
2. Upload file
3. ✅ Error table shows specific issues with row numbers

---

### ✅ Password Reset Approval

**Test Approval Flow:**
1. Open new incognito window
2. Go to http://localhost:5173/password-reset
3. Enter a user email
4. Submit request
5. Back in admin window, go to "Password Reset Requests"
6. ✅ Request appears in pending list
7. Click "Approve"
8. ✅ Success message shown
9. ✅ Check console for email log

**Test Rejection:**
1. Click "Reject" on a request
2. Enter reason (optional)
3. ✅ Request marked as rejected

---

### ✅ Department Management

**Test Create Department:**
1. Navigate to "Departments"
2. Click "Add Department"
3. Enter:
   - Name: Information Technology
   - Code: IT
4. Click "Create Department"
5. ✅ Department appears in list
6. ✅ Available in user creation dropdown

---

### ✅ Admin Dashboard

**Test Stats:**
1. Go to Admin Dashboard
2. ✅ Total Users count is accurate
3. ✅ Active Users count is accurate
4. ✅ Departments count is accurate
5. ✅ Pending Resets count is accurate

**Test Navigation:**
1. Click each quick action card
2. ✅ Navigates to correct page

---

## Common Issues & Solutions

### Backend Not Starting
**Error**: "JAVA_HOME not found"
**Solution**: Set JAVA_HOME environment variable
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### Database Connection Error
**Error**: "Access denied for user 'root'"
**Solution**: Check MySQL password in `application.properties`

### Email Not Sending
**Note**: Email service requires SMTP configuration. For testing, check console logs for email content.

### Excel Upload Fails
**Check**:
- File format is `.xlsx` or `.xls`
- Column headers match template exactly
- Department codes exist in database

---

## Test Data

### Sample Departments (Already in DB)
- CS - Computer Science
- ECE - Electronics and Communication
- ME - Mechanical Engineering
- CE - Civil Engineering
- EE - Electrical Engineering

### Sample Users to Create
```
Students:
- Alice Johnson, alice.j@test.com, CS2024001, CS, 2024
- Bob Smith, bob.s@test.com, ECE2024001, ECE, 2024

Faculty:
- Dr. Sarah Wilson, sarah.w@test.com, CS, Professor
- Dr. Mike Brown, mike.b@test.com, ECE, Associate Professor
```

---

## API Testing (Optional)

### Using cURL

**Get All Users:**
```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/admin/users
```

**Create User:**
```powershell
curl -X POST http://localhost:8080/api/admin/users `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"role\":\"STUDENT\",\"departmentId\":1}'
```

---

## Success Criteria

Sprint 2 is successful if:
- ✅ Can create users manually
- ✅ Can upload users via Excel
- ✅ Search and filters work
- ✅ Pagination works (with 10+ users)
- ✅ Password reset approval works
- ✅ Department management works
- ✅ All stats on dashboard are accurate
- ✅ Email logs appear in console

---

## Next Steps After Testing

1. Note any bugs or issues
2. Test with larger datasets (50+ users)
3. Test concurrent operations
4. Proceed to Sprint 3: Announcements Module
