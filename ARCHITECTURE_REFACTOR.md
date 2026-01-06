# Frontend Architecture Refactor - Domain-Based Structure

## Overview
The frontend has been refactored from a type-based structure (pages/, components/, hooks/, services/) to a domain-based (feature-based) architecture. Code is now organized by feature/domain (auth, users) with shared utilities in a `shared/` folder.

## New Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── sign-in.jsx
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   ├── useSignIn.js
│   │   │   ├── useProfile.js
│   │   │   └── index.js
│   │   ├── services.js
│   │   └── routes.jsx
│   │
│   ├── users/
│   │   ├── pages/
│   │   │   ├── home.jsx
│   │   │   ├── profile.jsx
│   │   │   └── index.js
│   │   ├── components/
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserModal.jsx
│   │   │   ├── UserInlineDetail.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileQuickActions.jsx
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   ├── useUsers.js
│   │   │   ├── useDashboardCounts.js
│   │   │   ├── useProfilePage.js
│   │   │   ├── useUserModal.js
│   │   │   ├── useUserInlineDetail.js
│   │   │   ├── useProfileModal.js
│   │   │   └── index.js
│   │   ├── services.js
│   │   └── routes.jsx
│
├── shared/
│   ├── components/
│   │   ├── DataTable/
│   │   ├── TableFilters/
│   │   ├── DatePicker.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorState.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── CountCard.jsx
│   │   └── index.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useErrorMessage.js
│   │   ├── useCrudOperations.js
│   │   ├── useDataFetching.js
│   │   ├── usePageLogic.js
│   │   ├── usePageHandlers.js
│   │   ├── useCrudHandlers.js
│   │   ├── useFilterConfig.js
│   │   ├── useDatePicker.js
│   │   ├── useDateRangePicker.js
│   │   ├── useDateRangeFilter.js
│   │   ├── useSearchFilter.js
│   │   ├── useLazyImage.js
│   │   └── index.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── index.js
│   └── services/
│       └── api.js
│
├── layouts/
│   ├── auth.jsx
│   ├── dashboard.jsx
│   └── index.js
│
├── providers/
│   ├── authContext.jsx
│   └── index.jsx
│
├── widgets/
│   ├── cards/
│   ├── charts/
│   └── layout/
│
├── config/
│   └── env.js
│
├── App.jsx
├── main.jsx
└── routes.jsx
```

## Migration Summary

### Auth Module (`src/modules/auth/`)
**Moved from:**
- `src/pages/auth/` → `src/modules/auth/pages/`
- `src/hooks/auth/` → `src/modules/auth/hooks/`
- `src/hooks/forms/useSignIn.js` → `src/modules/auth/hooks/useSignIn.js`
- `src/services/authService.js` → `src/modules/auth/services.js`

**Files:**
- `pages/sign-in.jsx` - Sign in page
- `hooks/useSignIn.js` - Sign in form logic
- `hooks/useProfile.js` - Profile data fetching (used by auth)
- `services.js` - Auth service (login, register, logout, etc.)
- `routes.jsx` - Auth route definitions

### Users Module (`src/modules/users/`)
**Moved from:**
- `src/pages/dashboard/admin/home.jsx` → `src/modules/users/pages/home.jsx`
- `src/pages/dashboard/user/profile.jsx` → `src/modules/users/pages/profile.jsx`
- `src/components/users/` → `src/modules/users/components/`
- `src/hooks/data/useUsers.js` → `src/modules/users/hooks/useUsers.js`
- `src/hooks/data/useDashboardCounts.js` → `src/modules/users/hooks/useDashboardCounts.js`
- `src/hooks/pages/useProfilePage.js` → `src/modules/users/hooks/useProfilePage.js`
- `src/hooks/components/useUserModal.js` → `src/modules/users/hooks/useUserModal.js`
- `src/hooks/components/useUserInlineDetail.js` → `src/modules/users/hooks/useUserInlineDetail.js`
- `src/hooks/components/useProfileModal.js` → `src/modules/users/hooks/useProfileModal.js`
- `src/services/userService.js` → merged into `src/modules/users/services.js`
- `src/services/roleService.js` → merged into `src/modules/users/services.js`

**Files:**
- `pages/home.jsx` - Dashboard home page (shows user stats)
- `pages/profile.jsx` - User profile page
- `components/` - All user-related components (UserTable, UserModal, ProfileCard, etc.)
- `hooks/` - All user-related hooks
- `services.js` - User and role services (exported as named exports)
- `routes.jsx` - User route definitions (Home, Profile)

### Shared (`src/shared/`)
**Moved from:**
- `src/components/common/` → `src/shared/components/`
- `src/hooks/utils/` → `src/shared/hooks/`
- `src/hooks/components/useDatePicker.js` → `src/shared/hooks/useDatePicker.js`
- `src/hooks/components/useDateRangePicker.js` → `src/shared/hooks/useDateRangePicker.js`
- `src/hooks/components/useDateRangeFilter.js` → `src/shared/hooks/useDateRangeFilter.js`
- `src/hooks/components/useSearchFilter.js` → `src/shared/hooks/useSearchFilter.js`
- `src/hooks/components/useLazyImage.js` → `src/shared/hooks/useLazyImage.js`
- `src/hooks/data/useCrudOperations.js` → `src/shared/hooks/useCrudOperations.js`
- `src/hooks/data/useDataFetching.js` → `src/shared/hooks/useDataFetching.js`
- `src/hooks/pages/usePageLogic.js` → `src/shared/hooks/usePageLogic.js`
- `src/hooks/pages/usePageHandlers.js` → `src/shared/hooks/usePageHandlers.js`
- `src/hooks/pages/useCrudHandlers.js` → `src/shared/hooks/useCrudHandlers.js`
- `src/hooks/pages/useFilterConfig.js` → `src/shared/hooks/useFilterConfig.js`
- `src/utils/validation.js` → `src/shared/utils/validation.js`
- `src/services/api.js` → `src/shared/services/api.js`

**Files:**
- `components/` - Reusable UI components (DataTable, filters, loading states, etc.)
- `hooks/` - Reusable hooks (debounce, error handling, CRUD operations, etc.)
- `utils/` - Utility functions (validation, etc.)
- `services/api.js` - Axios API instance with interceptors

## Import Path Updates

### Old Paths (Removed)
- `@/pages/*` → Use module-specific paths
- `@/components/*` → Use module-specific or `@/shared/components/*`
- `@/hooks/*` → Use module-specific or `@/shared/hooks/*`
- `@/services/*` → Use module-specific or `@/shared/services/api.js`
- `@/utils/*` → Use `@/shared/utils/*`

### New Paths
- `@/modules/auth/pages/*` - Auth pages
- `@/modules/auth/hooks/*` - Auth hooks
- `@/modules/auth/services` - Auth service
- `@/modules/users/pages/*` - User pages
- `@/modules/users/components/*` - User components
- `@/modules/users/hooks/*` - User hooks
- `@/modules/users/services` - User and role services
- `@/shared/components/*` - Shared components
- `@/shared/hooks/*` - Shared hooks
- `@/shared/utils/*` - Shared utilities
- `@/shared/services/api` - API instance

## Key Changes

### 1. Service Consolidation
- **Auth services:** `authService` exported from `modules/auth/services.js`
- **User services:** `userService` and `roleService` exported from `modules/users/services.js`
- **Shared API:** `api` instance in `shared/services/api.js`

### 2. Route Organization
- Each module has its own `routes.jsx` file
- Main `routes.jsx` imports and combines module routes
- Route paths remain the same for backward compatibility

### 3. Import Updates
All imports have been updated to use the new module structure:
- Module-specific code imports from `@/modules/{module}/...`
- Shared code imports from `@/shared/...`
- Layouts and providers remain at root level

### 4. Removed Dependencies
- Removed `projectService` references (leftover from cleanup)
- All project-related code has been removed

## Benefits

1. **Better Organization:** Code is grouped by feature/domain, making it easier to find related files
2. **Scalability:** Easy to add new modules (departments, roles, assets, etc.) following the same pattern
3. **Maintainability:** Each module is self-contained with its own pages, components, hooks, and services
4. **Reusability:** Shared utilities are clearly separated in `shared/`
5. **Clear Boundaries:** Module boundaries are explicit, reducing coupling

## Adding New Modules

To add a new module (e.g., `departments`):

1. **Create module structure:**
   ```
   src/modules/departments/
   ├── pages/
   ├── components/
   ├── hooks/
   ├── services.js
   └── routes.jsx
   ```

2. **Move/create files:**
   - Create pages in `pages/`
   - Create components in `components/`
   - Create hooks in `hooks/`
   - Create service in `services.js`
   - Define routes in `routes.jsx`

3. **Update main routes:**
   - Import routes from `modules/departments/routes.jsx`
   - Add to main `routes.jsx`

4. **Update layouts:**
   - Add routes to `layouts/dashboard.jsx` if needed

## Example: Adding Departments Module

```javascript
// src/modules/departments/services.js
import api from '@/shared/services/api';

export const departmentService = {
  getAllDepartments: async (params) => {
    const response = await api.get('/departments', { params });
    return response.data;
  },
  // ... other methods
};

// src/modules/departments/routes.jsx
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { Departments } from "./pages";

const iconConfig = { className: "w-5 h-5 text-inherit" };

export const departmentRoutes = [
  {
    icon: <BuildingOfficeIcon {...iconConfig} />,
    name: "departments",
    path: "/departments",
    element: <Departments />,
  },
];

// src/routes.jsx
import { departmentRoutes } from "@/modules/departments/routes";
// ... add to routes array
```

## Notes

- **No logic changes:** Only file organization and import paths changed
- **Backward compatible:** Route paths remain the same
- **Build verified:** Application builds successfully with new structure
- **All imports updated:** All files now use new module paths

