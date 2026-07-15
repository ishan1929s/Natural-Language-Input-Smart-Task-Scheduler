# Quick Reference: Smart Task Scheduler

## 🚀 Starting the Application

### Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### Required (Already Configured)
```env
PORT=3001
MONGODB_URL=mongodb+srv://...
JWT_ACCESS_TOKEN=...
JWT_REFRESH_TOKEN=...
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
WIT_API_KEY=...
FRONTEND_URL=http://localhost:5173
```

### Optional (Configure as needed)
```env
# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/v1/auth/github/callback

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Microsoft Speech SDK
MICROSOFT_SPEECH_KEY=your_key
MICROSOFT_SPEECH_REGION=your_region
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login
POST   /api/v1/auth/refresh           - Refresh token
POST   /api/v1/auth/logout            - Logout
GET    /api/v1/auth/me                - Get profile
PATCH  /api/v1/auth/update            - Update profile
PATCH  /api/v1/auth/change-password   - Change password
DELETE /api/v1/auth/delete            - Delete account
```

### Tasks
```
POST   /api/v1/tasks/                 - Create task
GET    /api/v1/tasks/                 - Get all tasks
GET    /api/v1/tasks/:id              - Get task by ID
PATCH  /api/v1/tasks/:id              - Update task
DELETE /api/v1/tasks/:id              - Delete task
PATCH  /api/v1/tasks/:id/complete     - Mark complete
PATCH  /api/v1/tasks/:id/archive      - Archive task
POST   /api/v1/tasks/:id/comments     - Add comment
GET    /api/v1/tasks/search           - Search tasks
GET    /api/v1/tasks/category/:cat    - Filter by category
```

### NLP & Recurring
```
POST   /api/v1/tasks/nlp/parse        - Parse natural language
POST   /api/v1/tasks/recurring        - Create recurring task
GET    /api/v1/tasks/recurring        - Get recurring tasks
PATCH  /api/v1/tasks/recurring/:id    - Update recurring task
```

### Voice
```
POST   /api/v1/voice/transcribe       - Transcribe audio
POST   /api/v1/voice/create-task      - Create task from voice
```

---

## ✅ Test Results

**Backend Tests:** 36/36 PASSED (100%)

```bash
# Run tests (requires server running)
cd backend
npm test
```

---

## 🔧 Common Issues & Solutions

### Issue: Port already in use
```bash
# Solution: Change PORT in .env or kill process
pkill -f "node.*server.js"
```

### Issue: MongoDB connection failed
```bash
# Solution: Check MONGODB_URL in .env
# Make sure MongoDB Atlas IP whitelist includes your IP
```

### Issue: Email not sending
```bash
# Solution: Configure EMAIL_USER and EMAIL_PASS in .env
# Use Gmail App Password, not regular password
# Enable "Less secure app access" or use App Password
```

### Issue: OAuth not working
```bash
# Solution: Set up OAuth app and add credentials to .env
# GitHub: https://github.com/settings/developers
# Google: https://console.cloud.google.com
```

---

## 📝 Example Usage

### Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:3001/api/v1/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Team Meeting",
    "description": "Discuss project roadmap",
    "deadline": "2025-10-25T14:00:00Z",
    "priority": "high",
    "category": "work"
  }'
```

### Create Task with Natural Language
```bash
curl -X POST http://localhost:3001/api/v1/tasks/nlp/parse \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "text": "Meeting with John tomorrow at 3pm for 1 hour urgent"
  }'
```

---

## 🎯 Features Available

✅ User registration and authentication  
✅ JWT token management  
✅ Task CRUD operations  
✅ Natural language task creation  
✅ Recurring tasks (daily, weekly, monthly)  
✅ Task search, filter, sort  
✅ Task comments  
✅ Task dependencies  
✅ Priority management  
✅ Reminders and deadlines  
✅ Archive system  

⚠️ Email notifications (requires configuration)  
⚠️ GitHub OAuth (requires configuration)  
⚠️ Google OAuth (not implemented)  
⚠️ Voice services (requires configuration)  

---

## 📚 Documentation

- **EXECUTIVE_SUMMARY.md** - High-level overview
- **COMPREHENSIVE_TEST_REPORT.md** - Detailed test results
- **FIXES_APPLIED.md** - Issues fixed during testing
- **README.md** - Full application documentation

---

## 🆘 Need Help?

1. Check COMPREHENSIVE_TEST_REPORT.md for detailed info
2. Check FIXES_APPLIED.md for known issues
3. Review environment variable configuration
4. Run test suite: `npm test`
5. Check server logs for errors

---

**Last Updated:** October 24, 2025
