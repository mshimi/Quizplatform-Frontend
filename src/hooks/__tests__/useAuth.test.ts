import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '../useAuth'
import { mockUser } from '../../test/test-utils'

// Mock the auth context
const mockAuthContextValue = {
  user: mockUser,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  authError: null,
}

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue,
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user data when authenticated', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.authError).toBeNull()
  })

  it('returns null user when not authenticated', () => {
    const unauthenticatedContext = {
      ...mockAuthContextValue,
      user: null,
      isAuthenticated: false,
    }

    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue(unauthenticatedContext)

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns loading state when authenticating', () => {
    const loadingContext = {
      ...mockAuthContextValue,
      isLoading: true,
    }

    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue(loadingContext)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
  })

  it('returns auth error when present', () => {
    const errorContext = {
      ...mockAuthContextValue,
      authError: 'Invalid credentials',
    }

    vi.mocked(require('../../context/AuthContext').useAuth).mockReturnValue(errorContext)

    const { result } = renderHook(() => useAuth())

    expect(result.current.authError).toBe('Invalid credentials')
  })

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth())

    expect(typeof result.current.login).toBe('function')
  })

  it('provides register function', () => {
    const { result } = renderHook(() => useAuth())

    expect(typeof result.current.register).toBe('function')
  })

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth())

    expect(typeof result.current.logout).toBe('function')
  })
})
