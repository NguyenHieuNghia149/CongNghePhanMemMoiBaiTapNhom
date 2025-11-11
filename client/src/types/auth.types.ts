export interface User {
  id: string
  email: string
  firstname: string | null
  lastname: string | null
  role: string
  avatarUrl?: string | null
  avatar?: string | null
  rankingPoints?: number
  status?: string
  createdAt: string
  lastLoginAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  firstname: string
  lastname: string
  passwordConfirm: string
  otp: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface UpdateProfileData {
  user: User
}
