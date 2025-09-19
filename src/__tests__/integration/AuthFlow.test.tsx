import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import App from '../App'
import { mockUser } from '../../test/test-utils'

// Mock all the services and hooks
vi.mock('../service/authService', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('../service/websocketService', () => ({
  connectWebSocket: vi.fn(),
  disconnectWebSocket: vi.fn(),
}))

// Mock the auth context to simulate different states
const mockAuthContextValue = {
  user: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  authError: null,
}

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContextValue,
}))

// Mock the WebSocket context
vi.mock('../context/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => children,
  useWebSocket: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

// Mock the router
vi.mock('../routes/AppRouter', () => ({
  default: () => <div data-testid="app-router">App Router</div>
}))

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders app with unauthenticated user', () => {
    mockAuthContextValue.user = null
    mockAuthContextValue.isAuthenticated = false

    render(<App />)

    expect(screen.getByTestId('app-router')).toBeInTheDocument()
  })

  it('renders app with authenticated user', () => {
    mockAuthContextValue.user = mockUser
    mockAuthContextValue.isAuthenticated = true

    render(<App />)

    expect(screen.getByTestId('app-router')).toBeInTheDocument()
  })

  it('shows loading state during authentication check', () => {
    mockAuthContextValue.user = null
    mockAuthContextValue.isAuthenticated = false
    mockAuthContextValue.isLoading = true

    render(<App />)

    expect(screen.getByText('Loading Application...')).toBeInTheDocument()
  })

  it('handles authentication error', () => {
    mockAuthContextValue.user = null
    mockAuthContextValue.isAuthenticated = false
    mockAuthContextValue.authError = 'Invalid credentials'

    render(<App />)

    expect(screen.getByTestId('app-router')).toBeInTheDocument()
  })
})
