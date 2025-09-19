import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { WebSocketProvider } from '../context/WebSocketContext'
import { vi } from 'vitest'

// Mock data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'STUDENT' as const,
}

export const mockModule = {
  id: '1',
  title: 'Test Module',
  description: 'A test module for testing',
  isFollowed: false,
  questionCount: 10,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export const mockQuiz = {
  id: '1',
  module: mockModule,
  numberOfQuestions: 5,
  numberOfCorrectAnswers: 3,
  completedAt: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  status: 'COMPLETED' as const,
}

export const mockLobby = {
  id: '1',
  host: mockUser,
  module: mockModule,
  participants: [mockUser],
  status: 'WAITING' as const,
  createdAt: '2024-01-01T00:00:00Z',
}

export const mockQuestion = {
  id: '1',
  questionText: 'What is 2 + 2?',
  answers: [
    { id: '1', text: '3' },
    { id: '2', text: '4' },
    { id: '3', text: '5' },
    { id: '4', text: '6' },
  ],
}

// Mock context values
export const mockAuthContextValue = {
  user: mockUser,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  authError: null,
}

export const mockWebSocketContextValue = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  notifications: [],
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <WebSocketProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WebSocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper function to create mock query data
export const createMockQueryData = (data: any) => ({
  data,
  isLoading: false,
  isError: false,
  error: null,
  isSuccess: true,
  isFetching: false,
  refetch: vi.fn(),
})

// Helper function to create mock mutation
export const createMockMutation = (data?: any, error?: any) => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn().mockResolvedValue(data),
  isPending: false,
  isError: !!error,
  isSuccess: !error,
  error,
  data,
  reset: vi.fn(),
})
