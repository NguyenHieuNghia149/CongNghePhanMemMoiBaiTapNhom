import { useAuthContext } from '../../contexts/AuthContext/useAuthContext'
import { AuthContextType } from '../../types/auth.types'

/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 *
 * @returns Authentication state and methods
 * @throws Error if used outside AuthProvider
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 *
 * // Login
 * await login({ email, password });
 *
 * // Logout
 * await logout();
 *
 * // Check auth status
 * if (isAuthenticated) {
 *   // User is authenticated
 * }
 */
export const useAuth = (): AuthContextType => {
  return useAuthContext()
}
