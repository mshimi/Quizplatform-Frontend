import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import ProtectedRoute from '../ProtectedRoute'

// Mock useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>
  }
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login')
  })

  it('shows loading when authentication is in progress', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Loading Application...')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
})
