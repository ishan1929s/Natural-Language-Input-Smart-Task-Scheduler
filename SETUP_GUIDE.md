# 🚀 **TaskMaster - Complete Setup & Run Guide**

## **Quick Start (2 Minutes)**

### **Step 1: Install Dependencies**

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### **Step 2: Setup Environment**

**Backend Environment (.env file):**
```bash
cd backend
cp .env.sample .env
```

**Edit the .env file with:**
```env
MONGODB_URL=mongodb://localhost:27017/scheduling_project
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long_and_secure
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_long_and_secure
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### **Step 3: Start MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### **Step 4: Run Both Applications**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### **Step 5: Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## **🎨 Impressive UI/UX Features**

### **✨ Modern Design Elements**
- **Gradient Text**: Beautiful animated gradient text effects
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Custom Scrollbars**: Styled scrollbars with gradients
- **Hover Effects**: Interactive hover animations
- **Loading Skeletons**: Elegant loading states

### **🎯 Enhanced Components**
- **Task Cards**: Modern cards with priority indicators
- **Dashboard Charts**: Interactive charts with Recharts
- **Voice Input**: Beautiful voice recording interface
- **Admin Panel**: Comprehensive admin dashboard
- **Job Monitoring**: Real-time job status tracking

### **📱 Responsive Design**
- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Mobile-optimized interactions
- **Adaptive Layout**: Responsive grid system
- **Dark Mode Ready**: Theme switching capability

---

## **🔧 Advanced Setup**

### **Optional: Email Configuration**
Add to backend/.env:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### **Optional: AI Services**
Add to backend/.env:
```env
WIT_API_KEY=your_wit_ai_key
MICROSOFT_SPEECH_KEY=your_speech_key
MICROSOFT_SPEECH_REGION=your_region
```

### **Optional: Production Build**
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

---

## **🎮 Usage Guide**

### **1. Authentication**
- Register a new account
- Login with credentials
- Automatic token refresh

### **2. Task Management**
- Create tasks with natural language
- Use voice input for quick creation
- Set priorities and deadlines
- Organize by categories

### **3. Dashboard**
- View task statistics
- Monitor completion trends
- Check upcoming deadlines
- Analyze productivity

### **4. Voice Features**
- Record voice notes
- Convert speech to tasks
- Natural language processing
- Audio file uploads

### **5. Admin Features**
- User management
- System monitoring
- Job status tracking
- Analytics dashboard

---

## **🚨 Troubleshooting**

### **Common Issues:**

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**2. Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5173
npx kill-port 5173
```

**3. Missing Dependencies**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Environment Variables**
```bash
# Check if .env file exists
ls -la backend/.env

# Validate environment
cd backend
node validate-env.js
```

---

## **🎯 Key Features**

### **🔥 Core Features**
- ✅ **Task CRUD**: Create, read, update, delete tasks
- ✅ **Natural Language**: AI-powered task parsing
- ✅ **Voice Input**: Speech-to-text task creation
- ✅ **Smart Scheduling**: Conflict detection and time slots
- ✅ **Recurring Tasks**: Complex RRULE patterns
- ✅ **Priority System**: 4-level priority management
- ✅ **Categories**: Organize tasks by type
- ✅ **Comments**: Add notes and comments
- ✅ **Archive System**: Archive completed tasks

### **🚀 Advanced Features**
- ✅ **Email Notifications**: Automated reminders
- ✅ **Background Jobs**: Cron-based scheduling
- ✅ **Analytics Dashboard**: Task completion insights
- ✅ **Admin Panel**: User and system management
- ✅ **Job Monitoring**: Real-time job tracking
- ✅ **Export/Import**: Backup and restore
- ✅ **Bulk Operations**: Multi-task actions
- ✅ **Search & Filter**: Advanced filtering
- ✅ **Responsive Design**: Mobile-friendly

### **🎨 UI/UX Features**
- ✅ **Modern Design**: Material-UI with custom theming
- ✅ **Smooth Animations**: Framer Motion transitions
- ✅ **Interactive Charts**: Recharts visualization
- ✅ **Loading States**: Skeleton loaders
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Form Validation**: Real-time validation
- ✅ **Accessibility**: WCAG compliant

---

## **📊 Performance**

### **Optimizations**
- **Code Splitting**: Lazy loading components
- **Image Optimization**: WebP format support
- **Caching**: React Query caching
- **Bundle Size**: Optimized builds
- **Lazy Loading**: Route-based splitting

### **Monitoring**
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Loading time tracking
- **User Analytics**: Usage statistics
- **Health Checks**: System status monitoring

---

## **🔒 Security**

### **Authentication**
- **JWT Tokens**: Secure token-based auth
- **Refresh Tokens**: Automatic token renewal
- **Password Hashing**: bcrypt encryption
- **Input Validation**: XSS protection

### **API Security**
- **CORS Configuration**: Cross-origin protection
- **Rate Limiting**: Request throttling
- **Input Sanitization**: SQL injection prevention
- **Secure Headers**: Security headers

---

## **🎉 Success!**

Your TaskMaster application is now running with:

- ✅ **Beautiful UI/UX** with modern design
- ✅ **Smooth Animations** and transitions
- ✅ **Interactive Charts** and visualizations
- ✅ **Voice Input** capabilities
- ✅ **Admin Dashboard** for management
- ✅ **Real-time Updates** and monitoring
- ✅ **Mobile Responsive** design
- ✅ **Production Ready** architecture

**Access your application at: http://localhost:5173**

Enjoy your new task management system! 🚀
