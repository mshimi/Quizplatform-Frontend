import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as authService from '../authService'
import { mockUser } from '../../test/test-utils'

// Mock axios
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('fetches current user successfully', async () => {
      const mockResponse = { data: mockUser }
      const mockAxios = await import('../api')
      vi.mocked(mockAxios.default.get).mockResolvedValue(mockResponse)

      const result = await authService.getCurrentUser()

      expect(mockAxios.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('handles API errors', async () => {
      const mockError = new Error('Unauthorized')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized')
    })
  })

  describe('login', () => {
    it('logs in user successfully', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' }
      const mockResponse = {
        data: {
          access_token: 'mock-token',
          user: mockUser,
        },
      }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.login(credentials)

      expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse.data)
    })

    it('handles login errors', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong-password' }
      const mockError = new Error('Invalid credentials')
      mockAxios.post.mockRejectedValue(mockError)

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('registers user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      }
      const mockResponse = {
        data: {
          access_token: 'mock-token',
          user: { ...mockUser, ...userData },
        },
      }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.register(userData)

      expect(mockAxios.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
    })

    it('handles registration errors', async () => {
      const userData = {
        email: 'invalid-email',
        password: '123',
        firstName: 'New',
        lastName: 'User',
      }
      const mockError = new Error('Validation failed')
      mockAxios.post.mockRejectedValue(mockError)

      await expect(authService.register(userData)).rejects.toThrow('Validation failed')
    })
  })

  describe('logout', () => {
    it('logs out user successfully', async () => {
      const mockResponse = { data: { message: 'Logged out successfully' } }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await authService.logout()

      expect(mockAxios.post).toHaveBeenCalledWith('/auth/logout')
      expect(result).toEqual(mockResponse.data)
    })

    it('handles logout errors gracefully', async () => {
      const mockError = new Error('Network error')
      mockAxios.post.mockRejectedValue(mockError)

      // Logout should not throw errors as it's called on component unmount
      const result = await authService.logout()
      expect(result).toBeUndefined()
    })
  })
})
