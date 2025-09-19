import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import QuizLobbyPage from '../QuizLobbyPage'
import { mockLobby, mockUser } from '../../test/test-utils'

// Mock useParams
const mockUseParams = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  }
})

// Mock the hooks
const mockUseLobby = vi.fn()
const mockUseCancelLobby = vi.fn()
const mockUseLeaveLobby = vi.fn()
const mockUseAuth = vi.fn()
const mockUseLobbyEvents = vi.fn()

vi.mock('../../hooks/useLobbyQueries', () => ({
  useLobby: () => mockUseLobby(),
  useCancelLobby: () => mockUseCancelLobby(),
  useLeaveLobby: () => mockUseLeaveLobby(),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('../../hooks/useLobbyEvents', () => ({
  useLobbyEvents: () => mockUseLobbyEvents(),
}))

// Mock child components
vi.mock('../../components/lobby/LobbyHeader', () => ({
  default: ({ lobby }: any) => <div data-testid="lobby-header">{lobby.module.title}</div>
}))

vi.mock('../../components/lobby/LobbyParticipants', () => ({
  default: ({ lobby }: any) => (
    <div data-testid="lobby-participants">
      {lobby.participants.map((p: any) => (
        <span key={p.id}>{p.firstName} {p.lastName}</span>
      ))}
    </div>
  )
}))

vi.mock('../../components/lobby/LobbyActions', () => ({
  default: ({ onCancel, onLeave, isHost, canStart }: any) => (
    <div data-testid="lobby-actions">
      {isHost && <button onClick={onCancel}>Cancel Lobby</button>}
      <button onClick={onLeave}>Leave Lobby</button>
      {canStart && <button>Start Quiz</button>}
    </div>
  )
}))

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>
  }
})

describe('QuizLobbyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseParams.mockReturnValue({ lobbyId: 'lobby-123' })
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
    })
    mockUseLobby.mockReturnValue({
      data: mockLobby,
      isLoading: false,
      isError: false,
    })
    mockUseCancelLobby.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mockUseLeaveLobby.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mockUseLobbyEvents.mockReturnValue(undefined)
  })

  it('renders lobby information correctly', () => {
    render(<QuizLobbyPage />)

    expect(screen.getByTestId('lobby-header')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-participants')).toBeInTheDocument()
    expect(screen.getByTestId('lobby-actions')).toBeInTheDocument()
  })

  it('redirects when no lobbyId provided', () => {
    mockUseParams.mockReturnValue({ lobbyId: undefined })

    render(<QuizLobbyPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/quizzes')
  })

  it('shows loading state', () => {
    mockUseLobby.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })

    render(<QuizLobbyPage />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('redirects when lobby not found', () => {
    mockUseLobby.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    })

    render(<QuizLobbyPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/quizzes')
  })

  it('redirects when lobby is cancelled', () => {
    const cancelledLobby = { ...mockLobby, status: 'CANCELLED' as const }
    mockUseLobby.mockReturnValue({
      data: cancelledLobby,
      isLoading: false,
      isError: false,
    })

    render(<QuizLobbyPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/quizzes')
  })

  it('redirects when user is not a participant', () => {
    const otherUser = { ...mockUser, email: 'other@example.com' }
    mockUseAuth.mockReturnValue({
      user: otherUser,
      isLoading: false,
    })

    render(<QuizLobbyPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/quizzes')
  })

  it('shows host controls when user is host', () => {
    render(<QuizLobbyPage />)

    expect(screen.getByText('Cancel Lobby')).toBeInTheDocument()
  })

  it('shows start button when host and enough participants', () => {
    const multiParticipantLobby = {
      ...mockLobby,
      participants: [
        mockLobby.participants[0],
        { ...mockLobby.participants[0], id: '2', firstName: 'Jane', lastName: 'Doe' }
      ]
    }
    mockUseLobby.mockReturnValue({
      data: multiParticipantLobby,
      isLoading: false,
      isError: false,
    })

    render(<QuizLobbyPage />)

    expect(screen.getByText('Start Quiz')).toBeInTheDocument()
  })

  it('calls cancel lobby when cancel button is clicked', () => {
    const mockCancelMutate = vi.fn()
    mockUseCancelLobby.mockReturnValue({
      mutate: mockCancelMutate,
      isPending: false,
    })

    render(<QuizLobbyPage />)

    const cancelButton = screen.getByText('Cancel Lobby')
    fireEvent.click(cancelButton)

    expect(mockCancelMutate).toHaveBeenCalledWith('lobby-123', expect.any(Object))
  })

  it('calls leave lobby when leave button is clicked', () => {
    const mockLeaveMutate = vi.fn()
    mockUseLeaveLobby.mockReturnValue({
      mutate: mockLeaveMutate,
      isPending: false,
    })

    render(<QuizLobbyPage />)

    const leaveButton = screen.getByText('Leave Lobby')
    fireEvent.click(leaveButton)

    expect(mockLeaveMutate).toHaveBeenCalledWith('lobby-123', expect.any(Object))
  })

  it('shows loading state for cancel action', () => {
    mockUseCancelLobby.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    render(<QuizLobbyPage />)

    const cancelButton = screen.getByText('Cancel Lobby')
    expect(cancelButton).toBeDisabled()
  })

  it('shows loading state for leave action', () => {
    mockUseLeaveLobby.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    render(<QuizLobbyPage />)

    const leaveButton = screen.getByText('Leave Lobby')
    expect(leaveButton).toBeDisabled()
  })

  it('has correct CSS classes for layout', () => {
    render(<QuizLobbyPage />)

    const container = screen.getByTestId('lobby-header').closest('div')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8', 'max-w-2xl')
  })
})
