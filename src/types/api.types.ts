// ============================================
// Common Types
// ============================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string | string[];
  statusCode?: number;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  user_number?: string;
  name: string;
  username: string;
  email?: string;
  address?: string;
  work_location?: 'remote' | 'office' | 'hybrid';
  role?: string | Role;
  role_name?: string;
  is_active?: boolean;
  social_insurance?: boolean;
  medical_insurance?: boolean;
  join_date?: string;
  contract_date?: string;
  departments?: Department[];
  attachments?: Attachment[];
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Attachment {
  id: string;
  path_URL: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
}

export interface CreateUserRequest {
  user_number: string;
  name: string;
  username: string;
  password: string;
  address: string;
  work_location: 'remote' | 'office' | 'hybrid';
  role: string;
  social_insurance?: boolean;
  medical_insurance?: boolean;
  join_date?: string;
  contract_date?: string;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  password?: string;
  address?: string;
  work_location?: 'remote' | 'office' | 'hybrid';
  role?: string;
  social_insurance?: boolean;
  medical_insurance?: boolean;
  join_date?: string;
  contract_date?: string;
}

export interface UserResponse {
  user: User;
  message?: string;
}

export interface UsersResponse {
  users: User[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data?: {
    items: User[];
    meta?: PaginationMeta;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  is_active?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================
// Asset Types
// ============================================

export interface Asset {
  id: string;
  label: string;
  type: string;
  asset_type: 'laptop' | 'phone' | 'mobile';
  model: string;
  serial_number: string;
  status: 'Active' | 'Inactive' | 'Selected' | 'In Process' | 'Pending' | 'Rejected';
  ram?: string;
  laptop_processor?: string;
  laptop_ssd?: string;
  laptop_hdd?: string;
  laptop_graphics_card?: string;
  laptop_monitor?: string;
  mobile_imei_1?: string;
  mobile_imei_2?: string;
  mobile_internal_memory?: string;
  mobile_external_memory?: string;
  phone_number?: string;
  phone_company?: string;
  phone_current_plan?: string;
  phone_legal_owner?: string;
  phone_comment?: string;
  details?: string;
  attachments?: Attachment[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssetRequest {
  label: string;
  type: string;
  asset_type: 'laptop' | 'phone' | 'mobile';
  model: string;
  serial_number: string;
  status?: 'Active' | 'Inactive';
  ram: string;
  laptop_processor?: string;
  laptop_ssd?: string;
  laptop_hdd?: string;
  laptop_graphics_card?: string;
  laptop_monitor?: string;
  mobile_imei_1?: string;
  mobile_imei_2?: string;
  mobile_internal_memory?: string;
  mobile_external_memory?: string;
  phone_number?: string;
  phone_company?: string;
  phone_current_plan?: string;
  phone_legal_owner?: string;
  phone_comment?: string;
  details?: string;
  images?: File[];
}

export interface UpdateAssetRequest {
  label?: string;
  type?: string;
  asset_type?: 'laptop' | 'phone' | 'mobile';
  model?: string;
  serial_number?: string;
  status?: 'Active' | 'Inactive' | 'Selected' | 'In Process' | 'Pending' | 'Rejected';
  ram?: string;
  laptop_processor?: string;
  laptop_ssd?: string;
  laptop_hdd?: string;
  laptop_graphics_card?: string;
  laptop_monitor?: string;
  mobile_imei_1?: string;
  mobile_imei_2?: string;
  mobile_internal_memory?: string;
  mobile_external_memory?: string;
  phone_number?: string;
  phone_company?: string;
  phone_current_plan?: string;
  phone_legal_owner?: string;
  phone_comment?: string;
  details?: string;
  images?: File[];
}

export interface AssetResponse {
  asset: Asset;
  message?: string;
}

export interface AssetsResponse {
  assets: Asset[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data?: {
    items: Asset[];
    meta?: PaginationMeta;
  };
}

export interface AssetFilters {
  search?: string;
  label?: string;
  type?: string;
  asset_type?: string;
  model?: string;
  serial_number?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================
// Asset Tracking Types
// ============================================

export interface AssetTracking {
  id: string;
  user_id: string;
  asset_id: string;
  assigned_at: string;
  removed_at?: string;
  is_active: boolean;
  user?: User;
  asset?: Asset;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssetTrackingRequest {
  user_id: string;
  asset_id: string;
  assigned_at?: string;
  removed_at?: string;
}

export interface UpdateAssetTrackingRequest {
  user_id?: string;
  asset_id?: string;
  assigned_at?: string;
  removed_at?: string;
}

export interface AssetTrackingResponse {
  assetTracking: AssetTracking;
  message?: string;
}

export interface AssetTrackingsResponse {
  assetTrackings: AssetTracking[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data?: {
    items: AssetTracking[];
    meta?: PaginationMeta;
  };
}

export interface AssetTrackingFilters {
  search?: string;
  user_id?: string;
  asset_id?: string;
  is_active?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardCounts {
  users: number;
  assets: number;
  activeTrackingCount: number;
}

export interface DashboardCountsResponse {
  counts: DashboardCounts;
  users: User[];
  assets: Asset[];
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  token?: string;
}

export interface RegisterRequest {
  user_number: string;
  name: string;
  username: string;
  password: string;
  address: string;
  work_location: 'remote' | 'office' | 'hybrid';
  role?: string;
  social_insurance?: boolean;
  medical_insurance?: boolean;
  join_date?: string;
  contract_date?: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

