import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import DashboardPage from '../DashboardPage'
import { mockUser } from '../../test/test-utils'

// Mock useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock child components
vi.mock('../../components/module/FollowedModulesSection', () => ({
  default: () => <div data-testid="followed-modules">Followed Modules</div>
}))

vi.mock('../../components/quiz/QuizHistorySection', () => ({
  default: () => <div data-testid="quiz-history">Quiz History</div>
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome banner with user name', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    expect(screen.getByText(`Willkommen zurück, ${mockUser.firstName}!`)).toBeInTheDocument()
  })

  it('renders welcome banner with default name when user has no firstName', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, firstName: undefined },
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    expect(screen.getByText('Willkommen zurück, Student!')).toBeInTheDocument()
  })

  it('renders welcome banner with default name when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(<DashboardPage />)

    expect(screen.getByText('Willkommen zurück, Student!')).toBeInTheDocument()
  })

  it('renders all dashboard sections', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    expect(screen.getByTestId('followed-modules')).toBeInTheDocument()
    expect(screen.getByTestId('quiz-history')).toBeInTheDocument()
  })

  it('renders feature cards with correct content', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    expect(screen.getByText('Lernen')).toBeInTheDocument()
    expect(screen.getByText('Übe mit Quizfragen')).toBeInTheDocument()
    
    expect(screen.getByText('Kollaborieren')).toBeInTheDocument()
    expect(screen.getByText('Erstelle & bewerte Inhalte')).toBeInTheDocument()
    
    expect(screen.getByText('Messen')).toBeInTheDocument()
    expect(screen.getByText('Fordere andere Studierende heraus')).toBeInTheDocument()
  })

  it('has correct CSS classes for layout', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    const welcomeBanner = screen.getByText(`Willkommen zurück, ${mockUser.firstName}!`).closest('div')
    expect(welcomeBanner).toHaveClass('bg-indigo-600', 'text-white', 'p-8', 'rounded-2xl', 'shadow-lg', 'mb-12')
  })

  it('renders description text', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    })

    render(<DashboardPage />)

    expect(screen.getByText('Bereit, dein Wissen zu erweitern? Entdecke Module, fordere Freunde heraus und trage zu unserer kollaborativen Lerngemeinschaft bei.')).toBeInTheDocument()
  })
})
