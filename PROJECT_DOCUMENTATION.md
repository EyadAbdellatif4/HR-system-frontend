# HR System Frontend - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Application Flow](#application-flow)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [File-by-File Explanation](#file-by-file-explanation)
9. [Unused Files](#unused-files)
10. [Development Guide](#development-guide)

---

## Project Overview

This is a **Human Resources Management System (HRMS)** frontend application built with React. It manages:
- **Employees/Users**: User profiles, roles, departments, work locations
- **Assets**: Company assets (laptops, phones, mobile devices) with detailed specifications
- **Asset Tracking**: Assignment of assets to employees with tracking history
- **Dashboard**: Overview of all system data with statistics

The application uses a **hybrid state management approach**:
- **Redux Toolkit (RTK Query)** for server state (API data)
- **Redux Toolkit Slices** for client-side UI state
- **React Query** (legacy, still present but being phased out)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Entry                        │
│                    (main.jsx)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Provider Layer (Contexts/Redux)                │
│  - Redux Provider (store)                                    │
│  - React Query Provider                                      │
│  - Material Tailwind Provider                                │
│  - Browser Router                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    App Component                             │
│              (App.jsx - Route Handler)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐           ┌──────────────────┐
│  Auth Layout  │           │ Dashboard Layout │
│  (Sign In)    │           │  (Main App)      │
└───────────────┘           └─────────┬────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────┐      ┌──────────┐      ┌──────────┐
            │  Home    │      │Employees │      │  Assets  │
            │  Page    │      │  Page    │      │  Page    │
            └──────────┘      └──────────┘      └──────────┘
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Redux Store                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │   RTK Query      │  │  Redux Slices    │              │
│  │   (Server State) │  │  (Client State)  │              │
│  ├──────────────────┤  ├──────────────────┤              │
│  │ - Users API      │  │ - authSlice      │              │
│  │ - Assets API     │  │ - searchSlice    │              │
│  │ - Tracking API   │  │ - uiSlice        │              │
│  │ - Dashboard API  │  │ - modalSlice    │              │
│  │ - Auth API       │  │ - formSlice     │              │
│  │                  │  │ - pageSlice     │              │
│  │                  │  │ - filterSlice   │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Dependencies
- **React 18.2.0**: UI library
- **React Router DOM 6.17.0**: Client-side routing
- **Redux Toolkit 2.11.2**: State management
- **RTK Query**: Server state management (part of Redux Toolkit)
- **React Query (@tanstack/react-query) 5.90.10**: Legacy data fetching (being phased out)
- **Axios 1.12.2**: HTTP client (used in services layer)

### UI Libraries
- **Material Tailwind 2.1.4**: Component library
- **Tailwind CSS 3.3.4**: Utility-first CSS framework
- **Lucide React 0.263.1**: Icon library
- **Heroicons 2.0.18**: Additional icons

### Build Tools
- **Vite 4.5.0**: Build tool and dev server
- **TypeScript 5.9.3**: Type checking (partially implemented)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## Project Structure

```
HR-system-frontend/
├── src/
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Root component with routing
│   ├── config/                     # Configuration files
│   ├── contexts/                    # React Context (legacy, mostly replaced by Redux)
│   ├── features/                   # RTK Query API slices (TypeScript)
│   ├── layouts/                    # Layout components (Auth, Dashboard)
│   ├── modules/                    # Feature modules
│   │   ├── admin/                  # Admin module
│   │   └── auth/                   # Authentication module
│   ├── providers/                  # Context providers
│   ├── routes.jsx                  # Route configuration (legacy)
│   ├── shared/                     # Shared components and utilities
│   ├── store/                      # Redux store and slices
│   ├── types/                      # TypeScript type definitions
│   └── widgets/                    # Reusable UI widgets
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.cjs             # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## Application Flow

### 1. Application Startup (`main.jsx`)

**Flow:**
1. React DOM renders the root element
2. Wraps app in providers (Redux, React Query, Router, Theme)
3. Initializes auth from localStorage
4. Renders `<App />` component

**Key Responsibilities:**
- Sets up global providers
- Configures React Query client
- Initializes Redux store
- Restores authentication state

### 2. Routing (`App.jsx`)

**Flow:**
1. Checks authentication state from Redux
2. Shows loading spinner if auth is loading
3. Routes to:
   - `/dashboard/*` → Dashboard layout (if authenticated)
   - `/auth/*` → Auth layout (if not authenticated)
   - `*` → Redirects based on auth status

### 3. Dashboard Layout (`layouts/dashboard.jsx`)

**Flow:**
1. Checks user authentication
2. Renders sidebar navigation
3. Renders top navbar with search
4. Renders page content based on route
5. Wraps in `SearchProvider` for global search

**Pages:**
- `/dashboard/home` → Home page (dashboard overview)
- `/dashboard/employees` → Employees list
- `/dashboard/assets` → Assets list
- `/dashboard/profile` → User profile

### 4. Data Fetching

**Two Approaches (Hybrid):**

**A. RTK Query (New - TypeScript pages)**
- `home.tsx`, `assets.tsx`, `employees.tsx` use RTK Query hooks
- Automatic caching and cache invalidation
- Optimistic updates for mutations

**B. React Query (Legacy - JavaScript pages)**
- `home.jsx`, `assets.jsx`, `employees.jsx` use React Query hooks
- Still functional but being phased out

---

## State Management

### Redux Store Structure

```typescript
{
  // Server State (RTK Query)
  api: {
    queries: { ... },      // Cached query results
    mutations: { ... },    // Mutation states
  },
  
  // Client State (Redux Slices)
  auth: {
    user: User | null,
    loading: boolean,
    isAuthenticated: boolean
  },
  search: {
    searchQuery: string
  },
  ui: {
    openSidenav: boolean,
    sidenavColor: string,
    sidenavType: string,
    transparentNavbar: boolean,
    fixedNavbar: boolean,
    openConfigurator: boolean
  },
  modal: {
    createUser: { isOpen: boolean, ... },
    createAsset: { isOpen: boolean, ... },
    assetDetail: { isOpen: boolean, item: Asset | null, ... },
    // ... other modals
  },
  form: {
    signIn: { formData: {...}, loading: boolean, ... },
    profile: { formData: {...}, user: User | null, ... }
  },
  page: {
    home: { imageErrors: {...}, selectedAsset: Asset | null, ... },
    employees: { ... },
    assets: { ... }
  },
  filter: {
    users: { search: string, role: string, ... },
    assets: { search: string, type: string, ... },
    assetTracking: { ... }
  }
}
```

### Redux Slices Explained

#### 1. `authSlice.ts`
- **Purpose**: Manages authentication state
- **State**: `user`, `loading`, `isAuthenticated`
- **Actions**: `setUser`, `setLoading`, `login`, `logout`, `initializeAuthFromStorage`
- **Usage**: Used throughout app to check auth status

#### 2. `searchSlice.ts`
- **Purpose**: Global search functionality
- **State**: `searchQuery` (string)
- **Actions**: `setSearchQuery`, `clearSearch`
- **Usage**: Navbar search bar updates this, pages filter based on it

#### 3. `uiSlice.ts`
- **Purpose**: UI settings (sidebar, navbar, configurator)
- **State**: Sidebar state, navbar settings, configurator state
- **Actions**: `setOpenSidenav`, `setSidenavColor`, etc.
- **Usage**: Material Tailwind UI customization

#### 4. `modalSlice.ts`
- **Purpose**: Manages all modal states
- **State**: Each modal has `isOpen`, `item`, `formData`, `isEditing`, `isSaving`
- **Actions**: `openModal`, `closeModal`, `updateModalFormData`, etc.
- **Usage**: All modals (CreateUser, CreateAsset, AssetDetail, etc.)

#### 5. `formSlice.ts`
- **Purpose**: Form state management
- **State**: `signIn` and `profile` forms with `formData`, `loading`, `validationErrors`, `touched`
- **Actions**: `updateFormField`, `setFormLoading`, `setValidationErrors`, etc.
- **Usage**: Sign-in and profile forms

#### 6. `pageSlice.ts`
- **Purpose**: Page-level UI state
- **State**: Per-page state (home, employees, assets)
- **Actions**: `setPageState`, `setExpandedRow`, `setImageError`, etc.
- **Usage**: Page-specific UI state (selected items, image errors, etc.)

#### 7. `filterSlice.ts`
- **Purpose**: Data table filter states
- **State**: Per-entity filters (users, assets, assetTracking)
- **Actions**: `setFilters`, `updateFilter`, `resetFilters`
- **Usage**: Table filtering and pagination

---

## API Integration

### RTK Query API Structure

#### Base API (`store/api/baseApi.ts`)
- **Purpose**: Base configuration for all API calls
- **Features**:
  - Automatic token injection from localStorage
  - FormData support for file uploads
  - 401 error handling (auto-logout)
  - Tag-based cache invalidation

#### Feature API Slices (`features/*/api/*.ts`)

**1. Users API (`features/users/api/usersApi.ts`)**
- **Endpoints**:
  - `getUsers`: Get all users with filters
  - `getUserById`: Get user by ID
  - `getCurrentUser`: Get logged-in user
  - `createUser`: Create new user
  - `updateUser`: Update user (with optimistic update)
  - `updateCurrentUser`: Update current user profile
  - `deleteUser`: Delete user (with optimistic update)
- **Tags**: `['User', 'LIST']` for cache invalidation

**2. Assets API (`features/assets/api/assetsApi.ts`)**
- **Endpoints**:
  - `getAssets`: Get all assets with filters
  - `getAssetById`: Get asset by ID
  - `createAsset`: Create asset (with file upload)
  - `updateAsset`: Update asset (with file upload, optimistic update)
  - `deleteAsset`: Delete asset (with optimistic update)
- **Tags**: `['Asset', 'LIST']` for cache invalidation
- **Special**: Handles FormData for image uploads

**3. Asset Tracking API (`features/asset-tracking/api/assetTrackingApi.ts`)**
- **Endpoints**:
  - `getAssetTrackings`: Get all tracking records
  - `getAssetTrackingsByUserId`: Get trackings for a user
  - `getAssetTrackingById`: Get tracking by ID
  - `createAssetTracking`: Assign asset to user
  - `updateAssetTracking`: Update tracking (optimistic update)
  - `deleteAssetTracking`: Remove tracking (optimistic update)
- **Tags**: `['AssetTracking', 'LIST']` for cache invalidation

**4. Dashboard API (`features/dashboard/api/dashboardApi.ts`)**
- **Endpoints**:
  - `getDashboardCounts`: Aggregates users, assets, and trackings
- **Special**: Uses `queryFn` to fetch from 3 endpoints in parallel
- **Tags**: `['Dashboard', 'LIST']` for cache invalidation

**5. Auth API (`features/auth/api/authApi.ts`)**
- **Endpoints**:
  - `login`: User login (stores token in localStorage)
  - `register`: User registration
- **Special**: Auto-stores token and user data on successful login

### Legacy Services (`modules/*/services.js`)

**Purpose**: Axios-based service layer (still used by some components)
- `modules/admin/services.js`: User, Asset, AssetTracking services
- `modules/auth/services.js`: Auth services

**Note**: These are being phased out in favor of RTK Query but are still functional.

---

## File-by-File Explanation

### Root Level Files

#### `package.json`
- **Purpose**: Project dependencies and scripts
- **Key Scripts**:
  - `npm run dev`: Start development server
  - `npm run build`: Build for production
  - `npm run preview`: Preview production build
- **Dependencies**: See [Technology Stack](#technology-stack)

#### `vite.config.js`
- **Purpose**: Vite build tool configuration
- **Key Settings**:
  - React plugin
  - Path alias `@` → `/src`
- **Usage**: Build configuration

#### `tsconfig.json` & `tsconfig.node.json`
- **Purpose**: TypeScript configuration
- **Status**: Partially implemented (some files are `.tsx`, others `.jsx`)
- **Note**: Project is in transition from JavaScript to TypeScript

#### `tailwind.config.cjs`
- **Purpose**: Tailwind CSS configuration
- **Usage**: Custom theme, colors, and utilities

---

### Source Files (`src/`)

#### Entry Point

**`main.jsx`**
- **Purpose**: Application entry point
- **Responsibilities**:
  1. Creates React root
  2. Sets up Redux Provider
  3. Sets up React Query Provider
  4. Sets up Browser Router
  5. Sets up Material Tailwind Theme Provider
  6. Initializes auth from localStorage
  7. Renders `<App />` component
- **Flow**: First file executed when app starts

**`App.jsx`**
- **Purpose**: Root component with top-level routing
- **Responsibilities**:
  1. Reads auth state from Redux
  2. Shows loading spinner during auth check
  3. Routes to Dashboard or Auth layout
  4. Handles redirects based on auth status
- **Routes**:
  - `/dashboard/*` → Dashboard layout
  - `/auth/*` → Auth layout
  - `*` → Redirects to appropriate layout

---

### Configuration

**`config/env.js`**
- **Purpose**: Environment configuration
- **Exports**: `getApiUrl()` function
- **Usage**: Returns API base URL from environment variables

---

### Contexts (Legacy)

**`contexts/SearchContext.jsx`**
- **Purpose**: Global search context (legacy, now uses Redux)
- **Status**: Wrapper around Redux `searchSlice`
- **Exports**: `useSearch()` hook, `SearchProvider` component
- **Note**: Maintained for backward compatibility

---

### Features (RTK Query API Slices)

**`features/users/api/usersApi.ts`**
- **Purpose**: RTK Query API slice for user operations
- **Exports**: Hooks like `useGetUsersQuery`, `useCreateUserMutation`, etc.
- **Usage**: TypeScript pages use these hooks

**`features/assets/api/assetsApi.ts`**
- **Purpose**: RTK Query API slice for asset operations
- **Exports**: Hooks like `useGetAssetsQuery`, `useCreateAssetMutation`, etc.
- **Special**: Handles FormData for file uploads

**`features/asset-tracking/api/assetTrackingApi.ts`**
- **Purpose**: RTK Query API slice for asset tracking operations
- **Exports**: Hooks for tracking CRUD operations

**`features/dashboard/api/dashboardApi.ts`**
- **Purpose**: RTK Query API slice for dashboard data
- **Special**: Aggregates data from multiple endpoints

**`features/auth/api/authApi.ts`**
- **Purpose**: RTK Query API slice for authentication
- **Exports**: `useLoginMutation`, `useRegisterMutation`

---

### Layouts

**`layouts/dashboard.jsx`**
- **Purpose**: Main application layout (authenticated users)
- **Components**:
  - `Sidenav`: Left sidebar navigation
  - `DashboardNavbar`: Top navbar with search
  - Page content area
  - `ToastContainer`: Global toast notifications
- **Routes**: Home, Profile, Employees, Assets
- **Features**: Protected route, global search provider

**`layouts/auth.jsx`**
- **Purpose**: Authentication layout (login/register)
- **Routes**: Sign-in, Register
- **Features**: Simple layout without sidebar

**`layouts/index.js`**
- **Purpose**: Exports layout components

---

### Modules

#### Admin Module (`modules/admin/`)

**Pages:**

**`pages/home.tsx` (TypeScript - Active)**
- **Purpose**: Dashboard home page
- **Features**:
  - Stats cards (users, assets, assigned assets)
  - Asset tracking table
  - Employees table (50% width)
  - Assets table (50% width)
  - Global search filtering
- **Data Fetching**: Uses RTK Query hooks
- **State**: Uses Redux for modals, selected items, image errors

**`pages/home.jsx` (JavaScript - Legacy)**
- **Purpose**: Same as `home.tsx` but uses React Query
- **Status**: Not actively used (TypeScript version takes precedence)

**`pages/assets.tsx` (TypeScript - Active)**
- **Purpose**: Assets management page
- **Features**:
  - Assets table with pagination
  - Create asset button
  - Assign asset button
  - Delete selected assets
  - Row click opens asset detail modal
- **Data Fetching**: Uses RTK Query hooks

**`pages/assets.jsx` (JavaScript - Legacy)**
- **Status**: Not actively used

**`pages/employees.tsx` (TypeScript - Active)**
- **Purpose**: Employees management page
- **Features**:
  - Users table with pagination
  - Create user button
  - Delete selected users
  - Row click opens user detail modal
- **Data Fetching**: Uses RTK Query hooks

**`pages/employees.jsx` (JavaScript - Legacy)**
- **Status**: Not actively used

**`pages/profile.jsx`**
- **Purpose**: User profile page
- **Features**: View and edit current user profile
- **Data Fetching**: Uses React Query (legacy)

**`pages/asset-tracking.jsx`**
- **Purpose**: Asset tracking page (legacy)
- **Status**: Not used (functionality moved to home page)

**`pages/index.js`**
- **Purpose**: Exports all page components
- **Note**: Exports TypeScript versions explicitly

**Hooks (`hooks/`):**

**`useAssets.js`**
- **Purpose**: React Query hook for assets (legacy)
- **Status**: Still used by some components, being phased out

**`useUsers.js`**
- **Purpose**: React Query hook for users (legacy)
- **Status**: Still used by some components

**`useAssetTracking.js`**
- **Purpose**: React Query hook for asset tracking (legacy)

**`useDashboardCounts.js`**
- **Purpose**: React Query hook for dashboard counts (legacy)

**Other hooks**: Profile, modal, and inline detail hooks (legacy)

**Services (`services.js`):**
- **Purpose**: Axios-based API service layer
- **Exports**: `userService`, `assetService`, `assetTrackingService`
- **Status**: Legacy, being phased out in favor of RTK Query

**Components (`components/`):**
- **Purpose**: Admin-specific components (legacy)
- **Status**: Some may be unused, check individual files

**Routes (`routes.jsx`):**
- **Purpose**: Defines admin routes for sidebar navigation
- **Exports**: `adminRoutes` array

#### Auth Module (`modules/auth/`)

**Pages:**

**`pages/sign-in.jsx`**
- **Purpose**: User login page
- **Features**: Username/password form, error handling

**`pages/register.jsx`**
- **Purpose**: User registration page
- **Features**: Registration form

**Hooks:**

**`hooks/useSignIn.js`**
- **Purpose**: Sign-in form logic
- **State**: Uses Redux `formSlice` for form state

**`hooks/useProfile.js`**
- **Purpose**: Profile page logic
- **State**: Uses Redux `formSlice` and `authSlice`

**`hooks/useRegister.js`**
- **Purpose**: Registration form logic

**Services (`services.js`):**
- **Purpose**: Auth API services (legacy)

---

### Providers

**`providers/authContext.jsx`**
- **Purpose**: Auth context provider (legacy, now uses Redux)
- **Status**: Wrapper around Redux `authSlice` for backward compatibility
- **Exports**: `useAuth()` hook

**`providers/index.jsx`**
- **Purpose**: Material Tailwind UI controller provider
- **State**: Uses Redux `uiSlice`
- **Exports**: `useMaterialTailwindController()` hook

---

### Store (Redux)

**`store/store.ts`**
- **Purpose**: Redux store configuration
- **Reducers**: All slices + RTK Query API reducer
- **Middleware**: RTK Query middleware + serializable check config

**`store/hooks.ts`**
- **Purpose**: Typed Redux hooks
- **Exports**: `useAppDispatch`, `useAppSelector`, and all RTK Query hooks

**`store/index.ts`**
- **Purpose**: Store exports

**`store/api/baseApi.ts`**
- **Purpose**: RTK Query base API configuration
- **Features**: Token injection, FormData support, error handling

**Slices (`store/slices/`):**
- See [State Management](#state-management) section for details

---

### Shared Components

**`shared/components/`**

**Modals:**

**`CreateUserModal.jsx`**
- **Purpose**: Modal for creating/editing users
- **Features**: Form with validation, image upload, dropdowns

**`CreateAssetModal.jsx`**
- **Purpose**: Modal for creating/editing assets
- **Features**: Form with asset type-specific fields, image upload

**`CreateAssetTrackingModal.jsx`**
- **Purpose**: Modal for assigning assets to users
- **Features**: User/asset selection, date pickers

**`AssetDetailModal.jsx`**
- **Purpose**: Modal for viewing/editing asset details
- **Features**: Read/edit mode, image display

**`AssetTrackingDetailModal.jsx`**
- **Purpose**: Modal for viewing/editing asset tracking details
- **Features**: User/asset display, date editing

**`UserDetailModal.jsx`**
- **Purpose**: Modal for viewing/editing user details
- **Features**: User profile display and editing

**UI Components:**

**`CountCard.jsx`**
- **Purpose**: Stat card component for dashboard
- **Props**: `title`, `icon`, `count`, `color`, `loading`, `onClick`

**`LoadingSpinner.jsx`**
- **Purpose**: Loading indicator
- **Props**: `fullScreen` (optional)

**`Toast.jsx` & `ToastContainer.jsx`**
- **Purpose**: Global toast notification system
- **Usage**: `window.showToast(message, type, duration)`
- **Types**: `success`, `error`, `info`

**`ProtectedRoute.jsx`**
- **Purpose**: Route protection component
- **Features**: Redirects to login if not authenticated

**Dropdowns:**

**`ImageDropdown.jsx`**
- **Purpose**: Dropdown with images (users, assets)
- **Features**: Shows image or fallback avatar

**`SimpleDropdown.jsx`**
- **Purpose**: Styled text dropdown
- **Usage**: Work location, role, asset type, status

**Date Pickers:**

**`SimpleDatePicker.jsx`**
- **Purpose**: Custom date picker component
- **Features**: Today button, clear button, portal rendering

**`DatePicker.jsx` & `DateRangePicker.jsx`**
- **Purpose**: Legacy date pickers (may be unused)

**Tree Visualization:**

**`AssetTree.jsx`**
- **Purpose**: Visual tree showing user and assigned assets
- **Features**: SVG connecting lines with animation

**Data Table (`DataTable/`):**
- **Purpose**: Reusable data table component
- **Features**: Pagination, sorting, filtering, responsive design

**Table Filters (`TableFilters/`):**
- **Purpose**: Filter components for tables
- **Components**: Date, date range, search, select filters

**Other Components:**
- `ErrorState.jsx`: Error display component
- `DeleteConfirmationDialog.jsx`: Confirmation dialog
- `InlineDetailActionBar.jsx`: Action bar for inline details

**`shared/hooks/`:**

**`useDataFetching.js`**
- **Purpose**: Generic data fetching hook (React Query)
- **Status**: Legacy

**`useCrudOperations.js`**
- **Purpose**: Generic CRUD operations hook
- **Status**: Legacy

**Other hooks**: Various utility hooks (debounce, date picker, etc.)

**`shared/services/api.js`**
- **Purpose**: Axios instance configuration
- **Features**: Base URL, token injection, error handling

**`shared/utils/`**
- **Purpose**: Utility functions
- **Files**: `validation.js`, `index.js`

---

### Types

**`types/api.types.ts`**
- **Purpose**: TypeScript type definitions for API
- **Exports**: Interfaces for User, Asset, AssetTracking, API responses, etc.
- **Usage**: Type safety for RTK Query and TypeScript components

---

### Widgets

**`widgets/layout/`**

**`sidenav.jsx`**
- **Purpose**: Left sidebar navigation
- **Features**: Collapsible, responsive, role-based menu items

**`dashboard-navbar.jsx`**
- **Purpose**: Top navbar
- **Features**: User menu, search bar, notifications

**`navbar.jsx`**
- **Purpose**: Auth layout navbar (simple)

**`footer.jsx`**
- **Purpose**: Footer component

**`configurator.jsx`**
- **Purpose**: UI configuration panel (theme, colors, etc.)

---

## Unused Files

### Potentially Unused Files

1. **`modules/admin/pages/asset-tracking.jsx`**
   - **Status**: Not used (functionality moved to home page)
   - **Reason**: Asset tracking table is now on home page

2. **`modules/admin/pages/home.jsx`, `assets.jsx`, `employees.jsx`**
   - **Status**: Legacy JavaScript versions
   - **Reason**: TypeScript versions (`.tsx`) are being used instead
   - **Note**: These are kept for reference but not actively imported

3. **`shared/components/DatePicker.jsx` & `DateRangePicker.jsx`**
   - **Status**: May be unused
   - **Reason**: Replaced by `SimpleDatePicker.jsx`
   - **Action**: Check if any components import these

4. **`routes.jsx` (root level)**
   - **Status**: May be unused
   - **Reason**: Routes are defined in `modules/*/routes.jsx`
   - **Action**: Check if this file is imported anywhere

5. **`modules/admin/components/` (some files)**
   - **Status**: May be unused
   - **Files**: `UserTable.jsx`, `UserModal.jsx`, `UserInlineDetail.jsx`, `ProfileModal.jsx`, etc.
   - **Reason**: May have been replaced by shared components
   - **Action**: Check imports to confirm usage

6. **Legacy React Query Hooks**
   - **Status**: Still functional but being phased out
   - **Files**: `useAssets.js`, `useUsers.js`, `useAssetTracking.js`, `useDashboardCounts.js`
   - **Reason**: Replaced by RTK Query hooks
   - **Note**: Some components still use these

### How to Identify Unused Files

1. Search for imports: `grep -r "import.*from.*filename" src/`
2. Check if file is exported in `index.js` files
3. Check if file is referenced in routes
4. Use IDE "Find Usages" feature

---

## Development Guide

### Adding a New Feature

1. **Create RTK Query API slice** (if needed):
   - Add to `features/[feature-name]/api/[feature]Api.ts`
   - Define endpoints with tags
   - Export hooks

2. **Create Redux slice** (if needed):
   - Add to `store/slices/[feature]Slice.ts`
   - Define state and actions

3. **Create page component**:
   - Add to `modules/[module]/pages/[page].tsx`
   - Use RTK Query hooks for data
   - Use Redux hooks for UI state

4. **Add route**:
   - Update `modules/[module]/routes.jsx`
   - Add route to layout

### State Management Best Practices

1. **Server State**: Use RTK Query
2. **UI State**: Use Redux slices
3. **Form State**: Use `formSlice` for complex forms
4. **Modal State**: Use `modalSlice`
5. **Local State**: Use `useState` for component-specific state

### API Integration

1. **New Endpoint**: Add to appropriate feature API slice
2. **Cache Invalidation**: Use tags (`providesTags`, `invalidatesTags`)
3. **Optimistic Updates**: Use `onQueryStarted` in mutations
4. **Error Handling**: Errors are handled in `baseApi.ts`

### Component Structure

```
Component/
├── Component.tsx          # Main component
├── Component.test.tsx    # Tests (if any)
└── index.ts              # Exports
```

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Use Material Tailwind components when appropriate

---

## Key Concepts Explained

### RTK Query vs React Query

**RTK Query (New)**:
- Part of Redux Toolkit
- Integrated with Redux store
- Automatic caching
- Tag-based cache invalidation
- Optimistic updates
- Used in TypeScript pages

**React Query (Legacy)**:
- Separate library
- Independent caching
- Manual cache invalidation
- Used in JavaScript pages
- Being phased out

### Redux Slices vs Context API

**Redux Slices**:
- Centralized state
- DevTools support
- Time-travel debugging
- Used for global state

**Context API**:
- Component tree scoped
- Simpler for small apps
- Used minimally (mostly legacy)

### TypeScript vs JavaScript

**TypeScript (`.tsx`)**:
- Type safety
- Better IDE support
- Used for new pages and RTK Query APIs

**JavaScript (`.jsx`)**:
- Legacy code
- Still functional
- Being migrated to TypeScript

---

## Troubleshooting

### Common Issues

1. **404 Error on `/dashboard/counts`**
   - **Solution**: Dashboard API uses `queryFn` to fetch from multiple endpoints
   - **File**: `features/dashboard/api/dashboardApi.ts`

2. **Duplicate Export Errors**
   - **Solution**: Check `index.js` files for duplicate exports
   - **Files**: `modules/*/hooks/index.js`

3. **Module Resolution Issues**
   - **Solution**: Ensure TypeScript files are explicitly imported in `index.js`
   - **File**: `modules/admin/pages/index.js`

4. **State Not Updating**
   - **Check**: RTK Query cache tags
   - **Check**: Redux slice actions are dispatched
   - **Check**: Component is subscribed to state

---

## Conclusion

This HR System frontend is a modern React application using:
- **Redux Toolkit** for state management
- **RTK Query** for server state
- **React Router** for routing
- **TypeScript** (partially) for type safety
- **Tailwind CSS** for styling

The project is in a **transition state**:
- Some pages use RTK Query (TypeScript)
- Some pages use React Query (JavaScript)
- Both approaches are functional

**Next Steps for Full Migration**:
1. Convert remaining JavaScript pages to TypeScript
2. Replace React Query hooks with RTK Query
3. Remove unused legacy files
4. Complete TypeScript migration

---

**Last Updated**: Based on current codebase state
**Maintained By**: Development Team

