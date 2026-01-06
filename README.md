# HR System Frontend

> **📚 For complete project documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**
> 
> The documentation file contains:
> - Detailed explanation of every file in the project
> - Application flow and architecture
> - State management explanation
> - API integration guide
> - Unused files list
> - Development guide

Frontend application for the HR Management System built with React, Material Tailwind, and Vite. A modern, responsive dashboard for managing employees, assets, and asset tracking.

---

## 🚀 Quick Start Guide (For Beginners)

This guide will help you set up and run the frontend application step by step, even if you're not familiar with technical terms.

### 📋 What You Need Before Starting

Before you begin, make sure you have these installed on your computer:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - Install it by following the installation wizard
   - To verify installation, open a terminal/command prompt and type: `node --version`
   - You should see a version number like `v18.x.x` or higher

2. **Backend API Running** (Required)
   - The frontend needs the backend API to be running first
   - Make sure you've set up and started the backend server (see backend README)
   - The backend should be running at: **http://localhost:3000**

### 🔧 Step-by-Step Setup Instructions

1. **Open Terminal/Command Prompt**
   - On Windows: Press `Win + R`, type `cmd`, and press Enter
   - On Mac: Press `Cmd + Space`, type `Terminal`, and press Enter
   - On Linux: Press `Ctrl + Alt + T`

2. **Navigate to the Frontend Folder**
   ```bash
   cd "C:\Users\YourName\Desktop\sparkflares\Voucher Management System\Coding\material-tailwind-dashboard-react"
   ```
   *(Replace the path with your actual project location)*

3. **Install Frontend Dependencies**
   ```bash
   npm install
   ```
   - This will download all required packages (may take 2-5 minutes)
   - Wait until you see "added X packages" message

4. **Configure Environment Settings**
   - Open `src/config/env.js` in your code editor
   - Update the configuration values directly in the file:
     - `DEFAULT_API_URL`: Set to your backend API URL (e.g., `http://localhost:3000` for local development)
     - `DEFAULT_ENCRYPTION_KEY`: Set to your encryption key (must match the backend encryption key)
   - **Note**: Configuration is set directly in the code file, not through `.env` files (best practice)

5. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   - You should see a message like "Local: http://localhost:5173"
   - The frontend is now running at: **http://localhost:5173**
   - **Keep this terminal window open** - don't close it!

6. **Open the Application**
   - Open your web browser (Chrome, Firefox, Edge, etc.)
   - Go to: **http://localhost:5173**
   - You should see the login page

### ✅ Verification Checklist

- [ ] Frontend server is running (terminal shows "Local: http://localhost:5173")
- [ ] Backend server is running (check backend terminal)
- [ ] You can access http://localhost:5173 (should show the login page)
- [ ] No error messages in the browser console (press F12 to check)

### 🛑 How to Stop the Server

- **To stop the frontend**: In the terminal, press `Ctrl + C`

### 🔄 How to Start Again Later

1. **Open Terminal/Command Prompt**
2. **Navigate to the Frontend Folder**:
   ```bash
   cd "path\to\material-tailwind-dashboard-react"
   ```
3. **Start the Server**:
   ```bash
   npm run dev
   ```

### ❓ Common Issues and Solutions

**Problem**: "npm: command not found"
- **Solution**: Node.js is not installed or not in your PATH. Reinstall Node.js and restart your terminal.

**Problem**: "Port 5173 already in use"
- **Solution**: Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal message for the actual port number.

**Problem**: "Network Error" or "Cannot connect to API"
- **Solution**: Make sure the backend server is running first at http://localhost:3000. Check `src/config/env.js` has the correct `DEFAULT_API_URL` value.

**Problem**: "Failed to fetch" errors in browser console
- **Solution**: 
  - Verify backend is running: Open http://localhost:3000/api in your browser
  - Check `src/config/env.js` has correct `DEFAULT_API_URL` value
  - Make sure both backend and frontend are running

**Problem**: "Decryption failed" errors
- **Solution**: Make sure `src/config/env.js` has the correct `DEFAULT_ENCRYPTION_KEY` value that matches your backend encryption key. Restart the dev server after updating the config file.

---

## 🚀 Features

### Core Features

- **User Authentication**: 
  - Secure login/logout functionality
  - JWT token management
  - Protected routes
  - Role-based navigation

- **Dashboard Home**: 
  - Statistics cards (Users, Vouchers, Projects counts)
  - Tracking data table with filtering
  - Real-time data updates

- **User Management**: 
  - View all users in a sortable, filterable table
  - Create, edit, and delete users
  - User role assignment
  - Project assignments
  - Inline detail view
  - Search functionality

- **Voucher Management**: 
  - View all vouchers with filtering and sorting
  - Create and edit vouchers
  - Template preview modal
  - Template encryption/decryption
  - Voucher assignment to users
  - Background image and activity name support

- **Voucher Generation**: 
  - Multi-step voucher generation form
  - Template selection
  - Form data input (contact info, dates, locations)
  - PDF preview and download
  - Real-time template rendering

- **Project Management**: 
  - View all projects
  - Create, edit, and delete projects
  - User assignments
  - Active/inactive status management

- **My Vouchers**: 
  - View user's assigned vouchers
  - Generate vouchers from templates
  - Voucher details view

- **My Voucher Tracking**: 
  - View user's generated voucher tracking records
  - Filter by project (user's assigned projects only)
  - Date range filtering
  - CSV export functionality
  - Search and sort capabilities

- **Admin Tracking Data**: 
  - View all tracking data (admin only)
  - Advanced filtering (search, project, date range)
  - Column sorting
  - Pagination

- **Profile Management**: 
  - View and edit user profile
  - Update personal information

### Advanced UI Features

- **Advanced Filtering**: 
  - Search across multiple fields
  - Project dropdown filtering
  - Date range picker (single calendar view)
  - Real-time filter updates with debouncing
  - Clear filters functionality

- **Table Features**: 
  - Sortable columns (ascending/descending)
  - Visual sort indicators (arrows)
  - Pagination with configurable items per page
  - Expandable row details
  - Loading states
  - Empty states
  - Error handling

- **Data Export**: 
  - CSV download for tracking data
  - Formatted data export

- **Responsive Design**: 
  - Mobile-friendly layout
  - Adaptive components
  - Touch-friendly interactions

- **Real-time Updates**: 
  - React Query for data fetching
  - Automatic cache invalidation
  - Optimistic updates
  - Loading indicators

- **Template System**: 
  - Encrypted template storage
  - Client-side decryption
  - Template preview
  - Placeholder replacement
  - HTML/CSS template rendering

## 🛠️ Tech Stack

### Frontend Technologies

- **Framework**: React 18.2.0 - UI library
- **Build Tool**: Vite 4.5.0 - Fast build tool
- **UI Library**: Material Tailwind 2.1.4 - Component library
- **Styling**: Tailwind CSS 3.3.4 - Utility-first CSS
- **State Management**: 
  - React Query (TanStack Query) - Server state management
  - React Context API - Global state (authentication)
- **Routing**: React Router DOM 6.17.0 - Client-side routing
- **HTTP Client**: Axios 1.12.2 - API requests
- **Icons**: Heroicons 2.0.18 - Icon library
- **Charts**: ApexCharts 3.44.0 - Data visualization
- **Encryption/Compression**: 
  - Web Crypto API - Client-side decryption
  - pako 2.1.0 - Gzip decompression
- **Form Handling**: Custom hooks and validation
- **Date Handling**: Native Date API with custom utilities

### Project Structure

```
material-tailwind-dashboard-react/
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common UI components
│   │   │   ├── DataTable.jsx          # Sortable, paginated table
│   │   │   ├── TableFilters.jsx       # Filter bar component
│   │   │   ├── DateRangePicker.jsx    # Date range selector
│   │   │   ├── DatePicker.jsx         # Single date picker
│   │   │   ├── LoadingSpinner.jsx     # Loading indicator
│   │   │   ├── ErrorState.jsx         # Error display
│   │   │   └── ProtectedRoute.jsx     # Route protection
│   │   ├── users/       # User-related components
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserModal.jsx
│   │   │   └── UserInlineDetail.jsx
│   │   ├── vouchers/    # Voucher-related components
│   │   │   ├── VoucherTable.jsx
│   │   │   ├── VoucherModal.jsx
│   │   │   ├── VoucherTrackingTable.jsx
│   │   │   ├── TrackingDataTable.jsx
│   │   │   ├── VoucherPreviewModal.jsx
│   │   │   └── TemplateViewModal.jsx
│   │   ├── projects/    # Project-related components
│   │   └── generate-voucher/  # Voucher generation components
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   └── dashboard/   # Dashboard pages
│   │       ├── home.jsx
│   │       ├── users.jsx
│   │       ├── vouchers.jsx
│   │       ├── projects.jsx
│   │       ├── my-vouchers.jsx
│   │       ├── my-voucher-tracking.jsx
│   │       └── profile.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useUsers.js
│   │   ├── useVouchers.js
│   │   ├── useProjects.js
│   │   ├── useMyVoucherTracking.js
│   │   ├── useTrackingData.js
│   │   ├── useDebounce.js
│   │   └── useDashboardCounts.js
│   ├── services/        # API service layer
│   │   ├── api.js       # Axios configuration
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── voucherService.js
│   │   └── projectService.js
│   ├── utils/           # Utility functions
│   │   ├── decryption.util.js    # Template decryption
│   │   ├── template-renderer.js  # Template rendering
│   │   └── validation.js         # Form validation
│   ├── providers/       # Context providers
│   │   └── authContext.jsx
│   ├── layouts/         # Layout components
│   │   ├── dashboard.jsx
│   │   └── auth.jsx
│   └── routes.jsx       # Route configuration
├── public/              # Static assets
└── package.json         # Dependencies
```

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (with hot reload) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎨 UI Components

### Common Components

- **DataTable**: Sortable, paginated table with expandable rows
- **TableFilters**: Filter bar with search, dropdowns, and date range
- **DateRangePicker**: Single calendar view for selecting date ranges
- **DatePicker**: Single date selection
- **LoadingSpinner**: Loading indicator component
- **ErrorState**: Error display component
- **CountCard**: Statistics card component
- **ProtectedRoute**: Route protection wrapper

### Page-Specific Components

- **UserTable**: User management table with inline editing
- **VoucherTable**: Voucher management table with template preview
- **ProjectTable**: Project management table
- **VoucherTrackingTable**: User's voucher tracking table
- **TrackingDataTable**: Admin tracking data table
- **GenerateVoucherForm**: Multi-step voucher generation form

## 🔧 Configuration

### Configuration

Configuration values are set directly in `src/config/env.js`:

```javascript
// API Configuration
const DEFAULT_API_URL = 'http://localhost:3000';

// Encryption Key Configuration
const DEFAULT_ENCRYPTION_KEY = 'your_32_character_encryption_key_here';
```

**Note**: Configuration is centralized in the code file, not through `.env` files. This is a best practice for production deployments.

### API Integration

The frontend communicates with the backend API through:
- **Axios**: HTTP client with interceptors
- **React Query**: Data fetching and caching
- **Services**: Organized API service layer

### Authentication Flow

1. User logs in via `/auth/sign-in`
2. JWT token stored in localStorage
3. Token included in all API requests
4. Protected routes check authentication
5. Token refresh on API calls

## 📱 Pages Overview

- **Home** (`/dashboard/home`): Dashboard with statistics and tracking data
- **Users** (`/dashboard/users`): User management (admin only)
- **Vouchers** (`/dashboard/vouchers`): Voucher management (admin only)
- **Projects** (`/dashboard/projects`): Project management (admin only)
- **My Vouchers** (`/dashboard/my-vouchers`): User's assigned vouchers
- **My Voucher Tracking** (`/dashboard/my-voucher-tracking`): User's tracking records
- **Profile** (`/dashboard/profile`): User profile management

## 🎯 Key Features Implementation

### Filtering System

- **Search**: Debounced search across multiple fields
- **Project Filter**: Dropdown with all projects (or user's projects)
- **Date Range**: Single calendar picker for date ranges
- **Clear Filters**: Reset all filters to default

### Sorting System

- **Column Sorting**: Click column headers to sort
- **Visual Indicators**: Arrows show sort direction
- **Toggle Logic**: None → ASC → DESC → None
- **Backend Integration**: Sends sortBy and sortOrder to API

### Pagination

- **Configurable Items Per Page**: 5, 10, 20, 50, 100
- **Page Navigation**: Previous/Next buttons
- **Page Numbers**: Direct page selection
- **Footer Display**: Shows current page and total pages

### Template System

- **Encryption**: Templates encrypted with AES-256-GCM
- **Compression**: Gzip compression for storage efficiency
- **Client Decryption**: Web Crypto API for decryption
- **Preview**: Real-time template preview with data
- **Placeholder Replacement**: Dynamic content insertion

## 📚 Additional Resources

### Third-Party Libraries Used

- [Material Tailwind](https://material-tailwind.com/) - Component library for Tailwind CSS and Material Design
- [Hero Icons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Apex Charts](https://apexcharts.com/) - Modern & Interactive open-source Charts

## 🔐 Authentication & Authorization

- **Login**: Email/password authentication
- **Token Management**: JWT token storage and refresh
- **Protected Routes**: Automatic redirect for unauthorized users
- **Role-Based UI**: Different views for Admin and User roles
- **Session Management**: Persistent login state

## 📊 Data Management

- **React Query**: Efficient data fetching and caching
- **Optimistic Updates**: Immediate UI updates
- **Error Handling**: Comprehensive error states
- **Loading States**: Visual feedback during data operations
- **Debouncing**: Optimized search input handling

## 🎨 User Experience

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading Indicators**: Visual feedback for async operations
- **Error Messages**: User-friendly error displays
- **Empty States**: Helpful messages when no data
- **Confirmation Dialogs**: Prevent accidental deletions
- **Form Validation**: Real-time input validation
- **Toast Notifications**: Success/error notifications (if implemented)

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of routes
- **Memoization**: React.memo for component optimization
- **Debounced Search**: Reduced API calls
- **React Query Caching**: Efficient data caching
- **Optimized Re-renders**: Proper dependency arrays

## 🌐 Browser Support

At present, we officially aim to support the last two versions of the following browsers:

- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Edge** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Opera** (latest 2 versions)

**Requirements**:
- Modern browser with ES6+ support
- Web Crypto API support (for template decryption)
- LocalStorage support (for token storage)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Production Configuration

Update `src/config/env.js` with your production values:

```javascript
const DEFAULT_API_URL = 'https://your-api-domain.com';
const DEFAULT_ENCRYPTION_KEY = 'your_production_encryption_key';
```

**Note**: For Docker/Cloud Build deployments, you can still override these values using build arguments if needed, but the primary configuration is in `src/config/env.js`.

### Deploy Options

- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop `dist` folder or connect repository
- **AWS S3 + CloudFront**: Upload `dist` folder to S3 bucket
- **GitHub Pages**: Deploy `dist` folder to GitHub Pages
- **Any Static Host**: Upload `dist` folder contents

### Build Optimization

- Code minification
- Tree shaking (removes unused code)
- Asset optimization
- Source maps (for debugging)

