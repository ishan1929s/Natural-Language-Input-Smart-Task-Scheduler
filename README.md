# Smart Task Scheduler

A comprehensive task management application with natural language processing, voice input, and intelligent scheduling features.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks
- **Natural Language Processing**: Create tasks using natural language input
- **Voice Input**: Record voice notes and convert them to tasks
- **Smart Scheduling**: AI-powered conflict detection and time slot suggestions
- **Recurring Tasks**: Support for complex recurring patterns using RRULE
- **Priority Management**: Four-level priority system (low, medium, high, urgent)
- **Category Organization**: Organize tasks by categories
- **Comments System**: Add comments and notes to tasks
- **Archive System**: Archive completed or old tasks

### Advanced Features
- **Email Notifications**: Automated reminder emails for deadlines
- **Background Jobs**: Cron-based scheduling for reminders and cleanup
- **Analytics Dashboard**: Task completion statistics and insights
- **Admin Panel**: User management and system monitoring
- **Job Monitoring**: Real-time background job status and management
- **Export/Import**: Backup and restore task data
- **Bulk Operations**: Perform actions on multiple tasks
- **Search & Filtering**: Advanced search and filtering capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Technical Features
- **JWT Authentication**: Secure authentication with refresh tokens
- **Role-Based Access**: User and admin roles with different permissions
- **Real-time Updates**: Live updates for task changes
- **File Upload**: Audio file processing for voice input
- **API Documentation**: Comprehensive REST API
- **Error Handling**: Robust error handling and user feedback
- **Performance Optimization**: Efficient database queries and caching
- **Security**: Input validation, XSS protection, and secure headers

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js with ES6 modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh token rotation
- **File Processing**: Multer for audio file uploads
- **NLP Processing**: Natural.js for text analysis
- **Email Service**: Nodemailer for email notifications
- **Scheduling**: Node-cron for background jobs
- **Speech Processing**: Microsoft Speech SDK integration
- **Date Processing**: Chrono-node for natural language date parsing
- **Recurrence**: RRule for complex recurring patterns

### Frontend (React + Vite)
- **Framework**: React 18 with Vite build tool
- **UI Library**: Material-UI (MUI) with custom theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router for navigation
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics visualization
- **Date Handling**: Day.js for date manipulation
- **Animations**: Framer Motion for smooth transitions
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **MongoDB**: Version 6.0 or higher
- **npm**: Version 8 or higher
- **Git**: For version control

### Optional (for advanced features)
- **Email Service**: Gmail, Outlook, or custom SMTP server
- **Microsoft Speech Service**: For voice processing
- **Wit.ai API**: For enhanced NLP processing

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-task-scheduler.git
cd smart-task-scheduler
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.sample .env

# Edit .env file with your configuration
nano .env
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup
```bash
# Start MongoDB (if not running as a service)
mongod

# Or use MongoDB Atlas (cloud database)
# Update MONGODB_URL in backend/.env with your Atlas connection string
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/scheduling_project

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long_and_secure
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_long_and_secure
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# AI Services (Optional)
WIT_API_KEY=your_wit_ai_api_key
MICROSOFT_SPEECH_KEY=your_microsoft_speech_key
MICROSOFT_SPEECH_REGION=your_microsoft_speech_region
```

### Frontend Configuration

The frontend automatically connects to the backend API. No additional configuration is required for basic functionality.

## 🚀 Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Production Mode

#### Using Docker
```bash
# Build and run with Docker
docker build -t scheduling-project .
docker run -p 3000:3000 -p 5173:5173 scheduling-project
```

#### Using Deployment Script
```bash
# Deploy locally
./deploy.sh local

# Deploy to various platforms
./deploy.sh aws
./deploy.sh gcp
./deploy.sh heroku
./deploy.sh railway
```

## 🧪 Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run e2e
```

### Test Coverage
```bash
cd frontend
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get user profile
- `PATCH /api/v1/auth/update` - Update user details
- `PATCH /api/v1/auth/email-config` - Update email config
- `PATCH /api/v1/auth/change-password` - Change password
- `DELETE /api/v1/auth/delete` - Delete user

### Task Endpoints
- `POST /api/v1/tasks/` - Create task
- `GET /api/v1/tasks/` - Get all tasks
- `GET /api/v1/tasks/:taskId` - Get specific task
- `PATCH /api/v1/tasks/:taskId` - Update task
- `DELETE /api/v1/tasks/:taskId` - Delete task
- `POST /api/v1/tasks/nlp/parse` - Parse natural language
- `POST /api/v1/tasks/recurring` - Create recurring task
- `GET /api/v1/tasks/reminders/stats` - Get reminder stats
- `POST /api/v1/tasks/reminders/check` - Check deadlines

### Voice Endpoints
- `POST /api/v1/voice/transcribe` - Transcribe audio to text
- `POST /api/v1/voice/parse` - Parse voice input into task data
- `POST /api/v1/voice/create-task` - Create task from voice input

## 🎯 Usage Examples

### Creating Tasks with Natural Language
```
"Meeting with John tomorrow at 3pm for 1 hour urgent work"
"Call dentist next Monday at 2pm for 30 minutes"
"Review project proposal by Friday high priority"
"Daily standup meeting every weekday at 9am"
```

### Voice Input Examples
- Record voice notes and convert them to structured tasks
- Use voice commands for quick task creation
- Process audio files for batch task creation

### Recurring Task Patterns
- Daily: `FREQ=DAILY`
- Weekly: `FREQ=WEEKLY;BYDAY=MO,WE,FR`
- Monthly: `FREQ=MONTHLY;BYMONTHDAY=1`
- Custom: Complex RRULE patterns

## 🔧 Development

### Project Structure
```
scheduling_project/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   └── utils/          # Utility functions
│   ├── uploads/            # File uploads
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── shared/         # Shared components
│   │   └── main.jsx        # Entry point
│   └── package.json
├── .github/
│   └── workflows/          # CI/CD pipelines
├── tests-e2e/             # E2E tests
└── README.md
```

### Adding New Features

1. **Backend**: Add new routes, controllers, and services
2. **Frontend**: Create new components and pages
3. **Database**: Update models and migrations
4. **Tests**: Add unit and E2E tests
5. **Documentation**: Update API docs and README

### Code Style
- **Backend**: ESLint + Prettier
- **Frontend**: ESLint + Prettier
- **Commits**: Conventional Commits format
- **Branches**: GitFlow branching model

## 🚀 Deployment

### Supported Platforms
- **AWS ECS**: Container-based deployment
- **Google Cloud Run**: Serverless containers
- **Heroku**: Platform-as-a-Service
- **Railway**: Modern deployment platform
- **Render**: Cloud platform for web services
- **DigitalOcean App Platform**: Managed applications
- **Docker**: Containerized deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URL=your_production_mongodb_url
JWT_ACCESS_TOKEN_SECRET=your_production_jwt_secret
JWT_REFRESH_TOKEN_SECRET=your_production_refresh_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
```

### CI/CD Pipeline
The project includes GitHub Actions workflows for:
- Automated testing
- Security scanning
- Docker image building
- Multi-platform deployment
- Performance monitoring

## 🔒 Security

### Authentication
- JWT tokens with short expiration
- Refresh token rotation
- Password hashing with bcrypt
- Input validation and sanitization

### API Security
- CORS configuration
- Rate limiting
- XSS protection headers
- SQL injection prevention
- File upload validation

### Data Protection
- Environment variable encryption
- Secure cookie settings
- HTTPS enforcement
- Database connection security

## 📊 Monitoring

### Health Checks
- API endpoint monitoring
- Database connection status
- Background job health
- Email service status

### Logging
- Structured logging with timestamps
- Error tracking and reporting
- Performance metrics
- User activity logs

### Analytics
- Task completion rates
- User engagement metrics
- Performance benchmarks
- Error frequency tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and API docs
- **Issues**: Create a GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers directly

### Common Issues

#### Backend Issues
- **MongoDB Connection**: Check MONGODB_URL and database status
- **JWT Errors**: Verify JWT secrets and token expiration
- **Email Failures**: Check email credentials and SMTP settings

#### Frontend Issues
- **API Connection**: Verify backend URL and CORS settings
- **Authentication**: Check token storage and refresh logic
- **Build Errors**: Ensure all dependencies are installed

#### Deployment Issues
- **Environment Variables**: Verify all required env vars are set
- **Database Access**: Check database connectivity and permissions
- **Port Conflicts**: Ensure ports are available and properly configured

## 🎉 Acknowledgments

- **Material-UI**: For the excellent React component library
- **TanStack Query**: For powerful data fetching and caching
- **MongoDB**: For the flexible document database
- **Express.js**: For the robust web framework
- **React**: For the amazing frontend library
- **Vite**: For the fast build tool
- **Playwright**: For reliable E2E testing

## 📈 Roadmap

### Upcoming Features
- **Mobile App**: React Native mobile application
- **Team Collaboration**: Multi-user task sharing
- **Calendar Integration**: Google Calendar and Outlook sync
- **Advanced Analytics**: Machine learning insights
- **API Webhooks**: Real-time event notifications
- **Offline Support**: Progressive Web App features
- **Multi-language**: Internationalization support
- **Dark Mode**: Enhanced UI themes

### Performance Improvements
- **Caching**: Redis-based caching layer
- **CDN**: Content delivery network integration
- **Database Optimization**: Query optimization and indexing
- **Bundle Splitting**: Code splitting for faster loading
- **Image Optimization**: WebP and lazy loading
- **Service Workers**: Background sync and offline support

---

**Made with ❤️ by the Smart Task Scheduler Team**
