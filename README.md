# HR Management System - Frontend Application

> **📚 Complete Beginner's Guide to Understanding This Project**

This is a comprehensive guide designed for beginners who want to understand every aspect of this HR Management System frontend application. We'll explain everything from the ground up, including the architecture, technologies, and how everything works together.

---

## 📖 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Project Overview](#project-overview)
3. [Architecture Explained](#architecture-explained)
4. [Technologies Used & Why](#technologies-used--why)
5. [Project Structure - Complete Guide](#project-structure---complete-guide)
6. [How the Application Starts](#how-the-application-starts)
7. [Understanding Features](#understanding-features)
8. [State Management Explained](#state-management-explained)
9. [API Calls & Data Fetching](#api-calls--data-fetching)
10. [Routing System](#routing-system)
11. [Common Patterns & Best Practices](#common-patterns--best-practices)
12. [How to Add a New Feature](#how-to-add-a-new-feature)
13. [Setup & Installation](#setup--installation)
14. [Development Guide](#development-guide)

---

## 🎯 What is This Project?

This is a **Human Resources (HR) Management System** - a web application that helps companies manage:

- **Employees**: View, create, edit, and manage employee information
- **Assets**: Track company assets (laptops, phones, equipment, etc.)
- **Asset Tracking**: Track which assets are assigned to which employees
- **Dashboard**: Overview of statistics and key information
- **User Profiles**: Manage user accounts and profiles

Think of it like a digital filing cabinet where HR managers can:
- See all employees in one place
- Track what equipment each employee has
- Add new employees or assets
- Update information
- View statistics and reports

---

## 🏗️ Project Overview

### What Makes This Project Special?

This project uses a **Clean Vertical Slice Architecture**. This is a modern way of organizing code that makes it:

- **Easy to understand**: All code related to one feature is in one place
- **Easy to maintain**: Changes to one feature don't break others
- **Easy to trace**: You can follow the logic from top to bottom in one folder
- **Easy to scale**: Adding new features is straightforward

### Real-World Analogy

Imagine a library:
- **Old way (bad)**: All books about "cooking" in one section, all books about "travel" in another, but recipes are scattered everywhere
- **New way (good)**: Each topic has its own complete section with everything related to it - books, guides, references, all together

Our project uses the "new way" - each feature (like "Assets" or "Users") has everything it needs in one place.

---

## 🏛️ Architecture Explained

### Clean Vertical Slice Architecture

**What is a "Vertical Slice"?**

A vertical slice means that for each feature (like "Assets" or "Users"), we organize ALL the code related to that feature in one folder:

```
features/admin/assets/
├── api/              ← How we talk to the backend (get/create/update assets)
├── components/       ← UI pieces (buttons, forms, modals)
├── hooks/            ← Reusable logic (data fetching, form handling)
├── pages/            ← The main page that users see
└── index.ts          ← Public interface (what other features can use)
```

**Why is this better?**

1. **Traceability**: When you open `AssetsPage.tsx`, you can see it imports from `../api/assetsApi.ts` and `../components/CreateAssetModal.tsx` - everything is nearby!

2. **Isolation**: If you need to change how assets work, you only touch files in the `assets/` folder

3. **No Fragmentation**: You don't have to search through 10 different folders to understand one feature

### The Three Main Folders

```
src/
├── features/    ← Feature-specific code (Assets, Users, etc.)
├── common/      ← Shared code used by multiple features
└── store/       ← Global state management
```

**features/**: Each feature is self-contained
**common/**: Things like buttons, loading spinners, utilities that everyone uses
**store/**: Global state (user login status, search query, etc.)

---

## 🛠️ Technologies Used & Why

### 1. **React** (v18.2.0)
**What it is**: A JavaScript library for building user interfaces
**Why we use it**: 
- Makes it easy to create interactive web pages
- Components can be reused
- Large community and lots of resources

**Example**: Instead of writing HTML directly, we write "components" that React turns into HTML

```jsx
// This is a React component
function Button() {
  return <button>Click Me</button>;
}
```

### 2. **TypeScript**
**What it is**: JavaScript with type checking
**Why we use it**:
- Catches errors before you run the code
- Makes code easier to understand (you know what type of data each variable holds)
- Better autocomplete in your code editor

**Example**:
```typescript
// TypeScript knows 'name' must be a string
const name: string = "John";

// This would cause an error:
const name: string = 123; // ❌ Error: number is not a string
```

### 3. **Redux Toolkit (RTK)**
**What it is**: A library for managing application state
**Why we use it**:
- Keeps track of data that multiple parts of the app need (like "is the user logged in?")
- Makes it easy to share data between components
- Provides tools for managing complex state

**Example**: When you log in, Redux stores your user information so any component can access it

### 4. **RTK Query**
**What it is**: Part of Redux Toolkit for fetching data from APIs
**Why we use it**:
- Automatically handles loading states
- Caches data so we don't fetch the same thing twice
- Handles errors automatically
- Updates UI when data changes

**Example**: When you load the Assets page, RTK Query:
1. Shows a loading spinner
2. Fetches data from the API
3. Displays the data
4. If there's an error, shows an error message

### 5. **React Router**
**What it is**: Library for navigation between pages
**Why we use it**:
- Makes the app feel like a real website (different URLs for different pages)
- Handles browser back/forward buttons
- Protects routes (requires login to access certain pages)

**Example**: 
- `/auth/sign-in` → Shows login page
- `/dashboard/home` → Shows dashboard
- `/dashboard/assets` → Shows assets page

### 6. **Material Tailwind**
**What it is**: A component library (pre-built UI components)
**Why we use it**:
- Provides beautiful, ready-to-use components (buttons, inputs, modals)
- Consistent design
- Saves time (don't have to build everything from scratch)

### 7. **Tailwind CSS**
**What it is**: A CSS framework for styling
**Why we use it**:
- Write styles directly in your code
- Consistent design system
- Easy to make responsive designs

**Example**:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  This div has a blue background, white text, padding, and rounded corners
</div>
```

### 8. **Vite**
**What it is**: A build tool and development server
**Why we use it**:
- Very fast development server
- Hot module replacement (changes appear instantly)
- Optimizes code for production

---

## 📁 Project Structure - Complete Guide

Let's explore the folder structure in detail:

```
HR-system-frontend/
├── src/                          # All source code lives here
│   ├── features/                 # Feature-specific code (the main part!)
│   │   ├── admin/                # Admin features (requires login)
│   │   │   ├── assets/           # Asset management feature
│   │   │   │   ├── api/          # API calls for assets
│   │   │   │   ├── components/   # Asset-specific UI components
│   │   │   │   ├── hooks/        # Asset-specific logic
│   │   │   │   ├── pages/        # The Assets page
│   │   │   │   └── index.ts      # Public API (exports)
│   │   │   ├── users/            # User/Employee management
│   │   │   ├── asset-tracking/   # Asset assignment tracking
│   │   │   ├── dashboard/       # Dashboard/home page
│   │   │   └── profile/          # User profile page
│   │   └── auth/                 # Authentication (login/register)
│   │       ├── api/              # Login/register API calls
│   │       ├── hooks/            # Login/register logic
│   │       ├── layouts/          # Auth page layout
│   │       ├── pages/            # Sign-in and Register pages
│   │       └── routes.tsx        # Auth routes
│   │
│   ├── common/                   # Shared code (used by multiple features)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── DataTable/       # Reusable table component
│   │   │   └── ...
│   │   ├── hooks/               # Reusable hooks
│   │   │   ├── useDebounce.ts   # Delays function calls
│   │   │   ├── useSearch.tsx    # Search functionality
│   │   │   └── ...
│   │   ├── layout/              # Layout components (sidebar, navbar)
│   │   ├── providers/           # Context providers
│   │   ├── services/            # Shared services (API client)
│   │   └── utils/               # Utility functions
│   │
│   ├── store/                   # Redux store (global state)
│   │   ├── api/                 # Base API configuration
│   │   ├── slices/              # Redux slices (state pieces)
│   │   │   ├── authSlice.ts     # User authentication state
│   │   │   ├── searchSlice.ts   # Search query state
│   │   │   └── ...
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   └── store.ts             # Store configuration
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── api.types.ts         # API response types
│   │
│   ├── config/                  # Configuration
│   │   └── env.js               # API URL, encryption keys
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Application entry point
│   └── routes.jsx               # Master route configuration
│
├── public/                      # Static files (images, etc.)
└── package.json                 # Dependencies and scripts
```

### Detailed Folder Explanations

#### `src/features/` - The Heart of the Application

This is where all the business logic lives. Each feature is completely self-contained.

**Example: Assets Feature**

```
features/admin/assets/
├── api/
│   └── assetsApi.ts          # Defines all API calls for assets
│                             # - getAssets (fetch list)
│                             # - createAsset (add new)
│                             # - updateAsset (edit)
│                             # - deleteAsset (remove)
│
├── components/
│   ├── CreateAssetModal.tsx  # Modal form to create new asset
│   ├── AssetDetailModal.tsx  # Modal to view/edit asset details
│   └── AssetTree.tsx         # Tree view showing asset assignments
│
├── hooks/
│   └── useAssets.ts          # Custom hook for asset operations
│                             # (might use old patterns, can be removed)
│
├── pages/
│   └── AssetsPage.tsx        # Main page component
│                             # - Shows table of assets
│                             # - Handles user interactions
│                             # - Manages state
│
└── index.ts                  # Public API
                             # Exports: AssetsPage, useGetAssetsQuery, etc.
```

**Why this structure?**

When you open `AssetsPage.tsx`, you can see:
- It imports `CreateAssetModal` from `../components/CreateAssetModal`
- It imports `useGetAssetsQuery` from `../api/assetsApi`
- Everything is right there! No searching through 10 folders.

#### `src/common/` - Shared Utilities

Things that multiple features use:

- **components/**: LoadingSpinner, ErrorState, DataTable (used everywhere)
- **hooks/**: useDebounce (delays search input), useSearch (global search)
- **layout/**: Sidebar, Navbar (used by dashboard)
- **providers/**: Auth context, Material Tailwind controller
- **utils/**: Validation functions, date helpers

#### `src/store/` - Global State

Manages state that the whole app needs:

- **slices/authSlice.ts**: Is user logged in? Who is the user?
- **slices/searchSlice.ts**: What is the current search query?
- **slices/uiSlice.ts**: Is sidebar open? What theme?
- **api/baseApi.ts**: Base configuration for all API calls

---

## 🚀 How the Application Starts

Let's trace what happens when you open the app:

### Step 1: Entry Point (`main.jsx`)

```jsx
// main.jsx - This is the FIRST file that runs
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";

// 1. Create Redux store (manages global state)
// 2. Wrap app in Redux Provider (makes store available everywhere)
// 3. Wrap in BrowserRouter (enables routing)
// 4. Render the App component
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

**What happens:**
1. React looks for an element with id="root" in `index.html`
2. Creates a React "root"
3. Renders the `<App />` component inside it
4. The entire app is wrapped in Redux Provider (for state) and BrowserRouter (for routing)

### Step 2: App Component (`App.jsx`)

```jsx
// App.jsx - Decides which layout to show
function AppRoutes() {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard/home" : "/auth/sign-in"} />} />
    </Routes>
  );
}
```

**What happens:**
1. Checks if user is logged in (from Redux store)
2. If loading, shows spinner
3. If URL starts with `/dashboard`, shows DashboardLayout
4. If URL starts with `/auth`, shows AuthLayout
5. Otherwise, redirects to login or dashboard

### Step 3: Layout Components

**DashboardLayout** (`features/admin/dashboard/layouts/DashboardLayout.tsx`):
- Shows sidebar (menu)
- Shows top navbar
- Shows page content based on URL

**AuthLayout** (`features/auth/layouts/AuthLayout.tsx`):
- Shows login or register page
- No sidebar/navbar (just the form)

### Step 4: Page Components

Based on the URL, React Router shows the appropriate page:
- `/dashboard/home` → `DashboardPage`
- `/dashboard/assets` → `AssetsPage`
- `/dashboard/employees` → `EmployeesPage`
- `/auth/sign-in` → `SignInPage`

---

## 🎨 Understanding Features

Let's break down how a feature works using the **Assets** feature as an example:

### 1. The Page Component (`AssetsPage.tsx`)

This is what the user sees. Let's understand it step by step:

```typescript
export function AssetsPage() {
  // 1. Get Redux dispatch function (to update state)
  const dispatch = useAppDispatch();
  
  // 2. Get search query from global state
  const { searchQuery } = useSearch();
  
  // 3. Local state (only this component needs)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<AssetFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // 4. RTK Query hook - automatically fetches data
  const { data: assetsData, isLoading: loading } = useGetAssetsQuery(filters);
  
  // 5. RTK Query mutations - for creating/updating/deleting
  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();

  // 6. Extract data from response
  const assets = assetsData?.assets || [];
  
  // 7. Handle user actions
  const handleCreate = async (data, files) => {
    await createAsset({ data, files }).unwrap();
    // RTK Query automatically refetches the list!
  };

  // 8. Render UI
  return (
    <div>
      <button onClick={() => dispatch(openModal({ modal: 'createAsset' }))}>
        Add Asset
      </button>
      {loading ? <LoadingSpinner /> : <AssetTable assets={assets} />}
      <CreateAssetModal onCreate={handleCreate} />
    </div>
  );
}
```

**Key Concepts:**

1. **useState**: Manages local state (like which rows are selected)
2. **useGetAssetsQuery**: Automatically fetches data when component mounts
3. **Mutations**: Functions to create/update/delete (like `createAsset`)
4. **Redux**: For global state (modals, search, etc.)

### 2. The API Layer (`assetsApi.ts`)

This defines HOW we talk to the backend:

```typescript
export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /assets?page=1&limit=10
    getAssets: builder.query<AssetsResponse, AssetFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', String(filters.page));
        // ... build query string
        return {
          url: `/assets?${params.toString()}`,
          method: 'GET',
        };
      },
      // Cache tags - tells RTK Query what to invalidate
      providesTags: (result) => [
        ...result.assets.map(({ id }) => ({ type: 'Asset', id })),
        { type: 'Asset', id: 'LIST' },
      ],
    }),

    // POST /assets (with FormData for file uploads)
    createAsset: builder.mutation<AssetResponse, { data: CreateAssetRequest; files?: File[] }>({
      query: ({ data, files }) => {
        const formData = buildAssetFormData(data, files);
        return {
          url: '/assets',
          method: 'POST',
          body: formData,
        };
      },
      // When asset is created, invalidate the list (refetch)
      invalidatesTags: [{ type: 'Asset', id: 'LIST' }],
    }),
  }),
});
```

**What this does:**

1. **getAssets**: When you call `useGetAssetsQuery(filters)`, it:
   - Makes a GET request to `/assets` with query parameters
   - Caches the result
   - Automatically refetches when filters change

2. **createAsset**: When you call `createAsset({ data, files })`, it:
   - Makes a POST request with FormData
   - After success, invalidates the cache
   - RTK Query automatically refetches the list

### 3. Components

**CreateAssetModal.tsx**: A form in a modal popup

```typescript
export function CreateAssetModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({ label: '', type: '', ... });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(formData, selectedFiles);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input value={formData.label} onChange={...} />
        <FileUpload onFilesChange={setSelectedFiles} />
        <Button type="submit">Create</Button>
      </form>
    </Modal>
  );
}
```

**How it works:**
1. User fills out the form
2. Clicks "Create"
3. Calls `onCreate` (passed from AssetsPage)
4. AssetsPage calls `createAsset` mutation
5. RTK Query sends request to backend
6. On success, list automatically updates!

---

## 🧠 State Management Explained

### What is State?

State is data that can change. Examples:
- Is the user logged in? (true/false)
- What assets are displayed? (array of asset objects)
- Is the modal open? (true/false)
- What page are we on? (number)

### Two Types of State

#### 1. **Local State** (useState)

State that only one component needs:

```typescript
// Only this component cares about selectedRows
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
```

**When to use**: When only one component needs the data

#### 2. **Global State** (Redux)

State that multiple components need:

```typescript
// Many components need to know if user is logged in
const user = useAppSelector((state) => state.auth.user);
```

**When to use**: When multiple components need the same data

### Redux Store Structure

```typescript
store = {
  auth: {
    user: { id: "1", name: "John" },
    loading: false,
    isAuthenticated: true
  },
  search: {
    searchQuery: "laptop"
  },
  ui: {
    openSidenav: true,
    sidenavType: "dark"
  },
  modal: {
    createAsset: { isOpen: false },
    assetDetail: { isOpen: true, item: {...} }
  },
  api: {
    // RTK Query cache
    queries: { ... },
    mutations: { ... }
  }
}
```

### How to Use Redux

**Reading state:**
```typescript
// Get user from Redux store
const user = useAppSelector((state) => state.auth.user);

// Get search query
const searchQuery = useAppSelector((state) => state.search.searchQuery);
```

**Updating state:**
```typescript
// Dispatch an action to update state
const dispatch = useAppDispatch();
dispatch(openModal({ modal: 'createAsset' }));
dispatch(setSearchQuery('laptop'));
```

### Redux Slices Explained

A "slice" is a piece of the Redux store. Example: `authSlice.ts`

```typescript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    isAuthenticated: false,
  },
  reducers: {
    // Action: login
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Action: logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
});
```

**How it works:**
1. Define initial state
2. Define "reducers" (functions that update state)
3. Redux automatically creates "actions" you can dispatch
4. When you dispatch `login(user)`, the reducer runs and updates state

---

## 🌐 API Calls & Data Fetching

### RTK Query - The Modern Way

RTK Query is built on Redux and makes API calls super easy.

### How It Works

**1. Define API endpoints:**

```typescript
// assetsApi.ts
export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<AssetsResponse, AssetFilters>({
      query: (filters) => ({
        url: '/assets',
        method: 'GET',
        params: filters,
      }),
    }),
  }),
});
```

**2. Use in components:**

```typescript
// AssetsPage.tsx
const { data, isLoading, error } = useGetAssetsQuery(filters);
```

**That's it!** RTK Query automatically:
- Makes the request
- Shows loading state
- Handles errors
- Caches the result
- Refetches when needed

### Automatic Features

**Caching:**
- If you call `useGetAssetsQuery` twice with same filters, it only makes one request
- Data is cached, so switching pages and coming back is instant

**Cache Invalidation:**
```typescript
createAsset: builder.mutation({
  invalidatesTags: [{ type: 'Asset', id: 'LIST' }],
})
```
When you create an asset, RTK Query automatically refetches the list!

**Optimistic Updates:**
```typescript
updateAsset: builder.mutation({
  async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
    // Update UI immediately (optimistic)
    const patchResult = dispatch(
      assetsApi.util.updateQueryData('getAssets', filters, (draft) => {
        const asset = draft.assets.find(a => a.id === id);
        if (asset) asset.label = data.label;
      })
    );
    
    try {
      await queryFulfilled; // Wait for server response
    } catch {
      patchResult.undo(); // Rollback if error
    }
  },
})
```

### File Uploads

RTK Query handles file uploads with FormData:

```typescript
createAsset: builder.mutation({
  query: ({ data, files }) => {
    const formData = new FormData();
    // Add data fields
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    // Add files
    files?.forEach(file => {
      formData.append('images', file);
    });
    
    return {
      url: '/assets',
      method: 'POST',
      body: formData, // FormData, not JSON!
    };
  },
})
```

---

## 🗺️ Routing System

### How Routing Works

React Router matches URLs to components:

```typescript
// routes.jsx - Master route configuration
const routes = [
  {
    layout: "dashboard",
    pages: [
      { path: "/home", element: <DashboardPage /> },
      { path: "/assets", element: <AssetsPage /> },
      { path: "/employees", element: <EmployeesPage /> },
    ],
  },
  {
    layout: "auth",
    pages: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
];
```

### Route Flow

1. User visits `/dashboard/assets`
2. `App.jsx` sees `/dashboard/*` → renders `DashboardLayout`
3. `DashboardLayout` sees `/assets` → renders `AssetsPage`
4. User sees the Assets page with sidebar and navbar

### Protected Routes

Some routes require login:

```typescript
<ProtectedRoute user={user} loading={loading}>
  {/* Protected content */}
</ProtectedRoute>
```

**How it works:**
- Checks if user is logged in
- If not, redirects to `/auth/sign-in`
- If yes, shows the content

---

## 🎯 Common Patterns & Best Practices

### Pattern 1: Feature Structure

Every feature follows this pattern:

```
feature-name/
├── api/           # API calls
├── components/    # UI components
├── hooks/         # Custom hooks (optional)
├── pages/         # Page component
└── index.ts       # Public exports
```

### Pattern 2: Component Structure

```typescript
// 1. Imports (React, libraries, local)
import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useGetDataQuery } from '../api/dataApi';

// 2. Component function
export function MyComponent({ prop1, prop2 }) {
  // 3. Hooks (state, effects, queries)
  const [localState, setLocalState] = useState();
  const { data } = useGetDataQuery();
  
  // 4. Event handlers
  const handleClick = () => {
    // Do something
  };
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Pattern 3: API Endpoint Definition

```typescript
getItems: builder.query<ResponseType, FiltersType>({
  query: (filters) => ({
    url: '/items',
    method: 'GET',
    params: filters,
  }),
  providesTags: (result) => [
    ...result.items.map(({ id }) => ({ type: 'Item', id })),
    { type: 'Item', id: 'LIST' },
  ],
}),
```

### Pattern 4: Mutation with File Upload

```typescript
createItem: builder.mutation<ResponseType, { data: DataType; files?: File[] }>({
  queryFn: async (arg, _api, _extraOptions, baseQuery) => {
    const { data, files } = arg;
    
    if (files?.length > 0) {
      const formData = new FormData();
      // Add data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      // Add files
      files.forEach(file => formData.append('images', file));
      
      const result = await baseQuery({
        url: '/items',
        method: 'POST',
        body: formData,
      });
      return { data: result.data as ResponseType };
    } else {
      // Regular JSON request
      const result = await baseQuery({
        url: '/items',
        method: 'POST',
        body: data,
      });
      return { data: result.data as ResponseType };
    }
  },
  invalidatesTags: [{ type: 'Item', id: 'LIST' }],
}),
```

### Pattern 5: Page Component

```typescript
export function MyPage() {
  // 1. Redux hooks
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(state => state.modal.myModal);
  
  // 2. Local state
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  
  // 3. RTK Query hooks
  const { data, isLoading } = useGetItemsQuery(filters);
  const [createItem] = useCreateItemMutation();
  
  // 4. Event handlers
  const handleCreate = async (data, files) => {
    await createItem({ data, files }).unwrap();
    dispatch(closeModal('myModal'));
  };
  
  // 5. Render
  return (
    <div>
      <button onClick={() => dispatch(openModal({ modal: 'myModal' }))}>
        Add Item
      </button>
      {isLoading ? <LoadingSpinner /> : <ItemTable items={data?.items} />}
      <CreateItemModal onCreate={handleCreate} />
    </div>
  );
}
```

---

## ➕ How to Add a New Feature

Let's say you want to add a "Projects" feature. Follow these steps:

### Step 1: Create Feature Structure

```bash
mkdir -p src/features/admin/projects/{api,components,hooks,pages}
```

### Step 2: Create API File

```typescript
// features/admin/projects/api/projectsApi.ts
import { baseApi } from '@/store/api/baseApi';
import type { Project, ProjectsResponse, CreateProjectRequest } from '@/types/api.types';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, ProjectFilters>({
      query: (filters) => ({
        url: '/projects',
        method: 'GET',
        params: filters,
      }),
      providesTags: (result) => [
        ...(result.projects || []).map(({ id }) => ({ type: 'Project', id })),
        { type: 'Project', id: 'LIST' },
      ],
    }),
    
    createProject: builder.mutation<ProjectResponse, CreateProjectRequest>({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
} = projectsApi;
```

### Step 3: Create Page Component

```typescript
// features/admin/projects/pages/ProjectsPage.tsx
import React, { useState } from 'react';
import { useGetProjectsQuery, useCreateProjectMutation } from '../api/projectsApi';
import { LoadingSpinner } from '@/common/components';
import { CreateProjectModal } from '../components/CreateProjectModal';

export function ProjectsPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useGetProjectsQuery(filters);
  const [createProject] = useCreateProjectMutation();

  const handleCreate = async (data) => {
    await createProject(data).unwrap();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Projects</h1>
      <button onClick={() => setShowModal(true)}>Add Project</button>
      <ProjectsTable projects={data?.projects} />
      <CreateProjectModal onCreate={handleCreate} />
    </div>
  );
}
```

### Step 4: Create Components

```typescript
// features/admin/projects/components/CreateProjectModal.tsx
export function CreateProjectModal({ isOpen, onClose, onCreate }) {
  // Form logic here
}
```

### Step 5: Create Public API

```typescript
// features/admin/projects/index.ts
export { ProjectsPage } from './pages/ProjectsPage';
export {
  useGetProjectsQuery,
  useCreateProjectMutation,
} from './api/projectsApi';
```

### Step 6: Add Route

```typescript
// features/admin/dashboard/routes.tsx
import { ProjectsPage } from '../projects';

export const adminRoutes = [
  // ... existing routes
  {
    icon: <FolderIcon />,
    name: "projects",
    path: "/projects",
    element: <ProjectsPage />,
  },
];
```

### Step 7: Update Store Hooks

```typescript
// store/hooks.ts
export * from '@/features/admin/projects/api/projectsApi';
```

That's it! Your new feature is integrated.

---

## 🚀 Setup & Installation

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Backend API Running**
   - The frontend needs the backend to be running
   - Default: `http://localhost:8080` (check `src/config/env.js`)

### Installation Steps

1. **Navigate to project folder:**
   ```bash
   cd HR-system-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This downloads all required packages (takes 2-5 minutes)

3. **Configure environment:**
   - Open `src/config/env.js`
   - Update `DEFAULT_API_URL_LOCAL` to your backend URL
   - Update `DEFAULT_ENCRYPTION_KEY` if needed

4. **Start development server:**
   ```bash
   npm run dev
   ```
   - Opens at: http://localhost:5173
   - Hot reload enabled (changes appear instantly)

5. **Open in browser:**
   - Go to: http://localhost:5173
   - You should see the login page

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 💻 Development Guide

### Understanding the Code Flow

**When user clicks "Add Asset" button:**

1. **AssetsPage.tsx**: Button click → `dispatch(openModal({ modal: 'createAsset' }))`
2. **Redux**: Updates `state.modal.createAsset.isOpen = true`
3. **AssetsPage.tsx**: Modal component receives `isOpen={true}` prop
4. **CreateAssetModal.tsx**: Modal appears, user fills form
5. **CreateAssetModal.tsx**: User clicks "Create" → calls `onCreate(formData, files)`
6. **AssetsPage.tsx**: `handleCreate` function calls `createAsset({ data, files }).unwrap()`
7. **RTK Query**: Sends POST request to `/assets` with FormData
8. **Backend**: Processes request, returns response
9. **RTK Query**: On success, invalidates cache
10. **RTK Query**: Automatically refetches `getAssets` query
11. **AssetsPage.tsx**: New data arrives, table updates automatically!

### Debugging Tips

**1. Check Redux State:**
```typescript
// Add this temporarily to see Redux state
console.log(useAppSelector(state => state));
```

**2. Check API Calls:**
- Open browser DevTools (F12)
- Go to "Network" tab
- See all API requests and responses

**3. Check React Components:**
- Install React DevTools browser extension
- See component tree and props

**4. Check Console:**
- Browser console shows errors and logs
- Look for red error messages

### Common Issues

**Problem: "Cannot find module"**
- Check import paths (should use `@/` alias)
- Make sure file exists

**Problem: "API request fails"**
- Check backend is running
- Check `src/config/env.js` has correct API URL
- Check browser Network tab for error details

**Problem: "State not updating"**
- Make sure you're using `useAppSelector` to read state
- Make sure you're using `dispatch` to update state
- Check Redux DevTools to see if action was dispatched

---

## 📚 Key Concepts for Beginners

### 1. Components

Components are reusable pieces of UI. Think of them like LEGO blocks:

```typescript
// A simple component
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// Use it multiple times
<Button text="Save" onClick={handleSave} />
<Button text="Cancel" onClick={handleCancel} />
```

### 2. Props

Props are data passed to components:

```typescript
// Parent component
<CreateAssetModal 
  isOpen={true}           // ← prop
  onClose={handleClose}  // ← prop
  onCreate={handleCreate} // ← prop
/>

// Child component receives props
function CreateAssetModal({ isOpen, onClose, onCreate }) {
  // Use props here
}
```

### 3. State

State is data that can change:

```typescript
// Local state (only this component knows about it)
const [count, setCount] = useState(0);

// Update state
setCount(count + 1);

// State causes re-render when it changes
```

### 4. Hooks

Hooks are functions that let you use React features:

- `useState`: Manage local state
- `useEffect`: Run code when component mounts or state changes
- `useAppSelector`: Read Redux state
- `useAppDispatch`: Get dispatch function
- `useGetAssetsQuery`: Fetch data (RTK Query)

### 5. JSX

JSX is HTML-like syntax in JavaScript:

```typescript
// This is JSX
<div className="container">
  <h1>Title</h1>
  <button onClick={handleClick}>Click Me</button>
</div>

// React converts it to JavaScript
React.createElement('div', { className: 'container' },
  React.createElement('h1', null, 'Title'),
  React.createElement('button', { onClick: handleClick }, 'Click Me')
)
```

### 6. Async/Await

For handling asynchronous operations (API calls):

```typescript
// Old way (callbacks)
fetch('/api/assets')
  .then(response => response.json())
  .then(data => console.log(data));

// New way (async/await) - easier to read
const response = await fetch('/api/assets');
const data = await response.json();
console.log(data);
```

### 7. TypeScript Types

Types tell TypeScript what kind of data to expect:

```typescript
// Define a type
interface Asset {
  id: string;
  label: string;
  type: string;
}

// Use the type
const asset: Asset = {
  id: "1",
  label: "Laptop",
  type: "Computer"
};

// TypeScript will error if you use wrong type
const asset: Asset = { id: 1 }; // ❌ Error: id must be string
```

---

## 🎓 Learning Path

If you're a beginner, here's a suggested learning path:

### Week 1: Basics
1. Learn React basics (components, props, state)
2. Understand JSX syntax
3. Learn about hooks (useState, useEffect)

### Week 2: Intermediate
1. Learn React Router (navigation)
2. Understand Redux basics (store, actions, reducers)
3. Learn RTK Query (data fetching)

### Week 3: Advanced
1. Understand TypeScript
2. Learn about file uploads (FormData)
3. Understand the project structure

### Week 4: Practice
1. Try modifying existing features
2. Add a simple new feature
3. Debug issues

---

## 🔍 Code Examples Explained

### Example 1: Simple Component

```typescript
// This component displays a loading spinner
export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}

// Usage
<LoadingSpinner message="Fetching assets..." />
```

**Breakdown:**
- `export function`: Makes it available to import elsewhere
- `{ message = "Loading..." }`: Props with default value
- `return`: Returns JSX (what to render)
- `className`: Tailwind CSS classes for styling

### Example 2: Component with State

```typescript
export function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

**Breakdown:**
- `useState(0)`: Creates state with initial value 0
- `[count, setCount]`: Destructuring (count = value, setCount = function to update)
- `onClick={increment}`: When button clicked, call increment function
- `{count}`: Display count value in JSX

### Example 3: Fetching Data

```typescript
export function AssetsPage() {
  const { data, isLoading, error } = useGetAssetsQuery({ page: 1, limit: 10 });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Failed to load assets" />;

  return (
    <div>
      {data?.assets.map(asset => (
        <div key={asset.id}>{asset.label}</div>
      ))}
    </div>
  );
}
```

**Breakdown:**
- `useGetAssetsQuery`: RTK Query hook that fetches data
- `{ data, isLoading, error }`: Destructure the result
- `isLoading`: True while fetching, false when done
- `error`: Contains error if request failed
- `data?.assets`: Optional chaining (safe if data is null)
- `.map()`: Loop through assets and render each one

### Example 4: Form Submission

```typescript
export function CreateAssetModal({ onCreate, onClose }) {
  const [formData, setFormData] = useState({ label: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsSaving(true);
    
    try {
      await onCreate(formData); // Call parent's function
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.label}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
      />
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Create'}
      </button>
    </form>
  );
}
```

**Breakdown:**
- `e.preventDefault()`: Stops form from refreshing page
- `async/await`: Handles asynchronous operations
- `try/catch`: Handles errors gracefully
- `disabled={isSaving}`: Disable button while saving
- `{...formData, label: e.target.value}`: Update only label, keep other fields

---

## 🎯 Best Practices

### 1. Always Use TypeScript Types

```typescript
// ✅ Good
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ❌ Bad
function Component(props) { // No types!
```

### 2. Use Feature Imports

```typescript
// ✅ Good - Use public API
import { AssetsPage } from '@/features/admin/assets';

// ❌ Bad - Deep imports
import { AssetsPage } from '@/features/admin/assets/pages/AssetsPage';
```

### 3. Keep Components Small

```typescript
// ✅ Good - Small, focused component
function AssetRow({ asset }) {
  return <tr><td>{asset.label}</td></tr>;
}

// ❌ Bad - Huge component doing everything
function AssetsPage() {
  // 500 lines of code...
}
```

### 4. Use RTK Query for Data Fetching

```typescript
// ✅ Good - RTK Query
const { data } = useGetAssetsQuery(filters);

// ❌ Bad - Manual fetch
useEffect(() => {
  fetch('/api/assets').then(...);
}, []);
```

### 5. Handle Loading and Error States

```typescript
// ✅ Good
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorState />;
return <DataTable data={data} />;

// ❌ Bad
return <DataTable data={data} />; // Crashes if data is null!
```

---

## 📖 Additional Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Learning Resources

- [React Tutorial](https://react.dev/learn)
- [Redux Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## 🐛 Troubleshooting

### Common Errors

**Error: "Module not found"**
- Check file path is correct
- Check file extension (.tsx vs .ts)
- Restart dev server

**Error: "Cannot read property of undefined"**
- Use optional chaining: `data?.assets`
- Check if data exists before using it

**Error: "Hook called conditionally"**
- Hooks must be called at the top level
- Don't put hooks inside if statements

**Error: "Maximum update depth exceeded"**
- Usually means infinite loop in useEffect
- Check dependency array

---

## 🎉 Conclusion

This project uses modern React patterns and best practices:

- **Clean Architecture**: Easy to understand and maintain
- **Type Safety**: TypeScript catches errors early
- **Efficient Data Fetching**: RTK Query handles caching and updates
- **Scalable**: Easy to add new features
- **Maintainable**: Clear structure and patterns

Remember:
- Each feature is self-contained
- Use RTK Query for all API calls
- Keep components small and focused
- Use TypeScript types everywhere
- Follow the established patterns

Happy coding! 🚀
