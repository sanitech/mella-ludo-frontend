# Mella Ludo Admin Panel Frontend

A modern React-based admin panel built with Vite, Tailwind CSS, and Headless UI for managing the Mella Ludo gaming platform.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.17.0
- npm >= 8.0.0

### Installation

1. **Install dependencies**
   ```bash
   cd mella-ludo-admin-pannel
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
mella-ludo-admin-pannel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard/
│   │   ├── Finance/
│   │   ├── Transactions/
│   │   ├── Users/
│   │   ├── Bans/
│   │   ├── Settings/
│   │   └── common/          # Shared components
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── FinanceManagement.jsx
│   │   ├── TransactionHistory.jsx
│   │   ├── UserManagement.jsx
│   │   ├── BanManagement.jsx
│   │   └── Settings.jsx
│   ├── services/            # API service functions
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── financeService.js
│   │   ├── transactionService.js
│   │   └── banService.js
│   ├── utils/               # Utility functions
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── helpers.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   ├── App.css              # Global styles
│   └── index.css            # Base styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build
npm run serve            # Serve production build on port 3000

# Building
npm run build            # Build for production
npm run build:prod       # Build with production mode

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Development
VITE_DEV_MODE=true
VITE_DEBUG_LEVEL=info
```

### Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
})
```

## 🎨 UI Components

### Core Components

#### Dashboard Components
- **Statistics Cards**: Display key metrics
- **Charts**: Visual data representation
- **Activity Feed**: Recent activities

#### Finance Components
- **Balance Display**: User balance information
- **Transaction Forms**: Deposit/withdrawal forms
- **Financial Statistics**: Revenue and transaction analytics

#### User Management Components
- **User List**: Paginated user table
- **User Details**: Individual user information
- **Ban Management**: User ban/unban functionality

#### Common Components
- **Navigation**: Sidebar navigation
- **Header**: Top navigation bar
- **Modal**: Reusable modal dialogs
- **Toast**: Notification system
- **Loading**: Loading states
- **Error**: Error handling components

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. API call to `/api/admin/login`
3. JWT token stored in localStorage
4. Redirect to dashboard

### Session Management
- Automatic token refresh
- Session timeout handling
- Logout functionality
- Multiple session management

### Protected Routes
- Route-level authentication checks
- Automatic redirect to login
- Session validation

## 📊 Data Management

### API Services

#### Auth Service
```javascript
// Login
const login = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

// Logout
const logout = async () => {
  await api.post('/admin/logout');
  localStorage.removeItem('token');
};
```

#### User Service
```javascript
// Get users
const getUsers = async (params) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Ban user
const banUser = async (userId, reason) => {
  const response = await api.put(`/users/${userId}/ban`, { reason });
  return response.data;
};
```

#### Finance Service
```javascript
// Get financial data
const getFinanceData = async () => {
  const response = await api.get('/finance');
  return response.data;
};

// Process transaction
const processTransaction = async (transactionData) => {
  const response = await api.post('/finance/transaction', transactionData);
  return response.data;
};
```

### State Management
- React hooks for local state
- Context API for global state
- Optimistic updates
- Error state handling

## 🎯 Features

### Dashboard
- **Overview Statistics**: Key metrics at a glance
- **Recent Activity**: Latest transactions and user actions
- **Quick Actions**: Common admin tasks
- **Real-time Updates**: Live data refresh

### User Management
- **User List**: Paginated user table with search
- **User Details**: Comprehensive user information
- **Ban Management**: User suspension system
- **User Statistics**: User activity analytics

### Financial Management
- **Balance Overview**: Total platform balance
- **Transaction Processing**: Deposit and withdrawal handling
- **Financial Analytics**: Revenue and transaction statistics
- **Auto-approval**: Automatic deposit processing

### Transaction History
- **Transaction List**: Complete transaction log
- **Filtering**: Date, type, and status filters
- **Search**: Transaction search functionality
- **Export**: Transaction data export

### Settings
- **Password Management**: Secure password changes
- **Session Management**: Active session control
- **General Settings**: Platform configuration

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Dark mode support
- Custom component styling

### Design System
- Consistent color palette
- Typography scale
- Spacing system
- Component variants

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interfaces

## 🔍 Error Handling

### Error Boundaries
- React error boundaries
- Graceful error fallbacks
- Error reporting

### API Error Handling
- Network error handling
- Server error responses
- Validation error display
- Retry mechanisms

### User Feedback
- Toast notifications
- Loading states
- Success messages
- Error messages

## 🧪 Testing

### Manual Testing
```bash
# Start development server
npm run dev

# Test different user scenarios
# Test responsive design
# Test error handling
```

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

### Deployment Options

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build project
npm run build

# Deploy to Netlify
# Upload dist folder to Netlify
```

#### Static Hosting
```bash
# Build project
npm run build

# Serve static files
npm run serve
```

### Environment Configuration
- Production API URL
- Analytics configuration
- Error reporting setup
- Performance monitoring

## 📈 Performance

### Optimization Techniques
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Load time monitoring

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Check for syntax errors

2. **API Connection Issues**
   - Verify API URL configuration
   - Check CORS settings
   - Verify network connectivity

3. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify CSS imports
   - Check browser compatibility

4. **Authentication Issues**
   - Clear browser storage
   - Check JWT token validity
   - Verify API authentication

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Headless UI Documentation](https://headlessui.com/)

---

**Version**: 1.0.0  
**Last Updated**: 2024 