# Backend Setup Instructions

# Step 1: Create Environment File
Create a .env file in the root directory:

# Database Configuration
MONGODB_URL=your_mongo_db_url

# JWT Configuration  
JWT_ACCESS_TOKEN=your_super_secret_access_token_key_here_make_it_long_and_secure
JWT_REFRESH_TOKEN=your_super_secret_refresh_token_key_here_make_it_long_and_secure
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Step 2: Start the Server
bash
npm start

# Step 3: Test the System
bash
node test-backend.js

--> Features Ready
- **Authentication**: JWT + Refresh Tokens
- **Task Management**: Full CRUD Operations
- **Natural Language**: AI-powered task parsing
- **Smart Scheduling**: Conflict detection + suggestions
- **Recurring Tasks**: RRule-based recurrence
- **Email Reminders**: Automated notifications
- **Email Configuration**: User-specific settings

# Testing
Run the comprehensive test suite:
bash
node test-backend.js

This will test all endpoints:
- User registration/login
- Task creation/management  
- NLP parsing
- Email configuration
- Token refresh
- Logout

# API Endpoints

## Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get user profile
- `PATCH /api/v1/auth/update` - Update user details
- `PATCH /api/v1/auth/email-config` - Update email config
- `PATCH /api/v1/auth/change-password` - Change password
- `DELETE /api/v1/auth/delete` - Delete user

## Tasks
- `POST /api/v1/tasks/` - Create task
- `GET /api/v1/tasks/` - Get all tasks
- `GET /api/v1/tasks/:taskId` - Get specific task
- `PATCH /api/v1/tasks/:taskId` - Update task
- `DELETE /api/v1/tasks/:taskId` - Delete task
- `POST /api/v1/tasks/nlp/parse` - Parse natural language
- `POST /api/v1/tasks/recurring` - Create recurring task
- `GET /api/v1/tasks/reminders/stats` - Get reminder stats
- `POST /api/v1/tasks/reminders/check` - Check deadlines



