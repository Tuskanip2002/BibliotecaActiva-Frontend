export interface LoginResponse {
  token: string;
}

export interface Resource {
  id: number;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  description: string;
}

export interface Operation {
  id: number;
  resourceId: number;
  resourceName: string;
  days: number;
  status: 'ACTIVE' | 'RETURNED';
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
}