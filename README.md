# Blocklog - Full-Stack Productivity & Blocker Analysis Tool 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

**🌐 Live Application**: `http://45.63.74.179`  
**🔧 API Endpoints**: `http://45.63.74.179/api`  
**📚 Backend Repository**: [blocklog-be](https://github.com/cosmosdesigner/blocklog-be)

Blocklog is a sophisticated **full-stack productivity tracking application** designed to help individuals and teams track, visualize, and manage "blockers"—events that halt progress on tasks. With real-time data synchronization, JWT authentication, and powerful analytics, you can gain deep insights into productivity patterns and reclaim lost time.

The application features a **React frontend** with **NestJS backend**, **PostgreSQL database**, and **production deployment** with Nginx reverse proxy and PM2 process management.

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **User Registration & Login** with encrypted password storage
- **Session Persistence** across browser sessions
- **Protected Routes** with authentication guards

### 📝 **Block Management**
- **Real-time Block Creation** with comprehensive details
- **Live Duration Tracking** with precise timing
- **Block Resolution** with automatic duration calculation
- **Tag System** with custom colors and descriptions
- **Block History** with filtering and search capabilities

### 📊 **Advanced Analytics Dashboard**
- **Key Performance Metrics**:
  - Total Blocks count
  - Ongoing vs Resolved blocks
  - Total Time Blocked (cumulative)
  - Longest Block identification
- **Interactive Data Visualization**:
  - Monthly bar charts with hover details
  - Yearly calendar heatmap view
  - Tag-based analytics and distribution
  - Time-series trend analysis

### 🌐 **Full-Stack Integration**
- **Real-time Data Synchronization** with PostgreSQL
- **RESTful API** with comprehensive endpoints
- **Optimistic UI Updates** for smooth user experience
- **Error Handling** with user-friendly feedback
- **Data Export/Import** capabilities

### 🚀 **Production-Ready Deployment**
- **Live Application** deployed and accessible
- **Nginx Reverse Proxy** for optimized performance
- **PM2 Process Management** with auto-restart
- **PostgreSQL Database** with sample data
- **SSL-Ready Configuration** for HTTPS deployment

---

## 🌐 Live Application

### **🎯 Access the Application**
Visit: **`http://45.63.74.179`**

### **🔑 Test Credentials**
- **Email**: `test@example.com`
- **Password**: `testpassword123`

### **🧪 Sample Data**
The application comes pre-loaded with:
- **2 Sample Blocks**: One ongoing, one resolved
- **2 Tags**: "Testing" (green) and "Development" (orange)
- **1 Test User**: Ready for immediate login

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Router**: TanStack Router for type-safe routing
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for responsive data visualizations
- **State Management**: Custom hooks with API integration

### **Backend Integration**
- **API**: NestJS RESTful API with TypeORM
- **Database**: PostgreSQL with structured schema
- **Authentication**: JWT with Passport.js strategy
- **Data Layer**: API service layer with data mapping utilities

### **Deployment Infrastructure**
- **Web Server**: Nginx with reverse proxy configuration
- **Process Manager**: PM2 for backend service management
- **Database**: PostgreSQL 14 with optimized indexes
- **Environment**: Ubuntu server with production optimization

---

## 📁 Project Structure

```
blocklog/
├── 📄 index.html              # Main HTML entry point with Tailwind CDN
├── 📄 index.tsx               # React application root renderer
├── 📄 App.tsx                 # Main app component with router setup
├── 📄 Routes.ts               # TanStack router configuration
├── 📄 types.ts                # Core TypeScript interfaces and enums
├── 📄 index.css               # Custom CSS styles and utilities
├── 📄 vite.config.ts          # Vite build configuration
├── 📄 package.json            # Dependencies and scripts
├── 📄 tsconfig.json           # TypeScript configuration
│
├── 📁 src/
│   ├── 📁 components/         # React components library
│   │   ├── 📁 auth/           # Authentication components
│   │   │   └── LoginForm.tsx          # JWT login form with validation
│   │   ├── 📁 dashboard/      # Dashboard and analytics
│   │   │   ├── Dashboard.tsx          # Main dashboard container
│   │   │   ├── 📁 components/         # Dashboard widgets
│   │   │   │   ├── BlockChart.tsx     # Monthly/yearly visualizations
│   │   │   │   ├── StatCard.tsx       # Metric display cards
│   │   │   │   └── TagAnalytical.tsx  # Tag-based analytics
│   │   │   └── 📁 hooks/              # Dashboard-specific hooks
│   │   │       └── useBlocks.tsx      # API-integrated block management
│   │   ├── 📁 yearView/       # Calendar visualization
│   │   │   ├── YearView.tsx           # Yearly calendar container
│   │   │   ├── 📁 components/         # Calendar components
│   │   │   │   ├── Calendar.tsx       # Main calendar grid
│   │   │   │   ├── Month.tsx          # Month view component
│   │   │   │   ├── dayCell.tsx        # Individual day cells
│   │   │   │   └── calendarEmptyState.tsx  # Empty state handling
│   │   │   └── 📁 hooks/              # Calendar-specific hooks
│   │   │       └── useYearView.tsx    # Calendar data management
│   │   ├── BlockCard.tsx      # Individual block display component
│   │   ├── BlockDetails.tsx   # Block detail modal with actions
│   │   ├── BlockForm.tsx      # Block creation/editing form
│   │   ├── BlockList.tsx      # Block listing with filters
│   │   ├── FilterControls.tsx # Advanced filtering interface
│   │   ├── Header.tsx         # Application header with navigation
│   │   ├── Modal.tsx          # Reusable modal component
│   │   ├── RootComponent.tsx  # Root app wrapper with auth
│   │   ├── TagInput.tsx       # Tag selection and creation
│   │   └── Button.tsx         # Standardized button component
│   │
│   ├── 📁 services/           # API integration layer
│   │   ├── api.ts             # Complete API client with endpoints
│   │   └── dataMapping.ts     # Frontend/backend data transformers
│   │
│   ├── 📁 hooks/              # Reusable React hooks
│   │   ├── useLocalStorage.ts # Local storage state management
│   │   ├── UseOnClickOutside.ts # Click outside detection
│   │   └── useRandomColor.tsx # Color generation utility
│   │
│   ├── 📁 routes/             # TanStack Router pages
│   │   ├── IndexRoute.tsx     # Home page with block list
│   │   ├── DashboardRoute.tsx # Analytics dashboard page
│   │   └── DataRoute.tsx      # Data management page
│   │
│   └── 📁 lib/                # Utility functions
│       ├── utils.ts           # Date/time calculations and helpers
│       └── const.ts           # Application constants
│
├── 📁 dist/                   # Production build output
└── 📁 src-tauri/             # Tauri desktop app configuration (future)
```

---

## 🔗 API Integration

### **Authentication Endpoints**
```typescript
POST /api/auth/login       // User login with JWT response
POST /api/auth/register    // User registration
GET  /api/auth/profile     // Get current user profile
PUT  /api/auth/profile     // Update user profile
```

### **Block Management**
```typescript
GET    /api/blocks              // List all blocks (paginated, filterable)
POST   /api/blocks              // Create new block
GET    /api/blocks/:id          // Get specific block details
PUT    /api/blocks/:id          // Update block information
PATCH  /api/blocks/:id/resolve  // Mark block as resolved
DELETE /api/blocks/:id          // Delete block
```

### **Tag System**
```typescript
GET    /api/tags           // List all user tags
POST   /api/tags           // Create new tag
GET    /api/tags/stats     // Get tag usage statistics
PUT    /api/tags/:id       // Update tag details
DELETE /api/tags/:id       // Delete tag
```

### **Analytics & Reporting**
```typescript
GET /api/analytics/dashboard    // Dashboard statistics
GET /api/analytics/monthly     // Monthly aggregated data
GET /api/analytics/daily       // Daily breakdown
GET /api/analytics/export      // Export user data
```

---

## 🚀 Development Setup

### **Prerequisites**
- Node.js 18+
- Git

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/cosmosdesigner/blocklog.git
cd blocklog

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Environment Configuration**
The application automatically connects to the production API. For local development with a custom backend:

1. Update `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3001'; // Your local backend
```

2. Ensure CORS is configured in your backend for your development URL.

---

## 🔧 Production Deployment

The application is deployed using modern DevOps practices:

### **Architecture**
```
[Browser] → [Nginx:80] → [React Frontend]
                      ↓ /api/*
[Browser] → [Nginx:80] → [Nginx Proxy] → [NestJS:3001] → [PostgreSQL:5432]
```

### **Deployment Features**
- **✅ Auto-SSL Ready**: Configured for Let's Encrypt integration
- **✅ Process Management**: PM2 handles backend processes with auto-restart
- **✅ Reverse Proxy**: Nginx optimizes static assets and API routing
- **✅ Database Optimization**: PostgreSQL with proper indexing
- **✅ Monitoring**: Comprehensive logging and error tracking
- **✅ Security**: Proper CORS, headers, and authentication

### **Performance Optimizations**
- Gzip compression for static assets
- Browser caching for optimal loading
- Optimistic UI updates for instant feedback
- Efficient database queries with proper indexes
- CDN-ready static asset serving

---

## 🧪 Testing & Quality Assurance

### **Manual Testing Checklist**
- ✅ User registration and login flow
- ✅ Block creation with tags and validation
- ✅ Real-time duration tracking accuracy
- ✅ Block resolution and deletion
- ✅ Dashboard analytics and visualizations
- ✅ Data export/import functionality
- ✅ Responsive design across devices
- ✅ API error handling and recovery

### **Browser Compatibility**
- ✅ Chrome/Chromium 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔮 Roadmap & Future Enhancements

### **🏃‍♂️ In Progress**
- **Team Collaboration Features**
  - Shared workspaces for team block visibility
  - Role-based permissions and access control
  - Team analytics and comparative insights

### **🎯 Planned Features**
- **AI-Powered Assistant**
  - Intelligent block resolution suggestions
  - Pattern recognition and proactive insights
  - Integration with Google Gemini AI
  
- **Advanced Integrations**
  - Jira, GitHub, and Slack connectivity
  - Calendar integration for time blocking
  - Slack notifications and bot commands
  
- **Enhanced Analytics**
  - Custom reporting and PDF exports
  - Goal setting and progress tracking
  - Productivity trend predictions

### **🔧 Technical Improvements**
- **Desktop Application** (Tauri-based)
- **Mobile Application** (React Native)
- **Real-time Collaboration** (WebSocket integration)
- **Advanced Security** (2FA, SSO integration)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Test thoroughly** including API integration
5. **Commit with conventional commits**: `git commit -m "feat: add amazing feature"`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with detailed description

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Test API integrations thoroughly
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS Team** for the robust backend framework
- **React Team** for the powerful frontend library
- **Tailwind CSS** for the elegant styling system
- **Recharts** for beautiful data visualizations
- **PostgreSQL** for reliable data persistence

---

**🚀 Built with ❤️ for productivity enthusiasts and development teams**

*Transform your blockers into breakthroughs with Blocklog - because every obstacle is an opportunity for improvement.*
