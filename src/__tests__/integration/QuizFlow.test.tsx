import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import QuizLobbyPage from '../pages/QuizLobbyPage'
import LiveSessionPage from '../pages/LiveSessionPage'
import { mockLobby, mockUser, mockQuestion } from '../../test/test-utils'

// Mock useParams
const mockUseParams = vi.fn()
const mockUseSearchParams = vi.fn()
const mockUseNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useSearchParams: () => mockUseSearchParams(),
    useNavigate: () => mockUseNavigate(),
  }
})

// Mock the hooks
const mockUseLobby = vi.fn()
const mockUseCancelLobby = vi.fn()
const mockUseLeaveLobby = vi.fn()
const mockUseAuth = vi.fn()
const mockUseLobbyEvents = vi.fn()
const mockUseLiveSessionState = vi.fn()
const mockUseSubmitLiveAnswer = vi.fn()
const mockUseLiveEvents = vi.fn()

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

vi.mock('../../hooks/useLiveQuiz', () => ({
  useLiveSessionState: () => mockUseLiveSessionState(),
  useSubmitLiveAnswer: () => mockUseSubmitLiveAnswer(),
}))

vi.mock('../../hooks/useLiveEvents', () => ({
  useLiveEvents: () => mockUseLiveEvents(),
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

describe('Quiz Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseParams.mockReturnValue({ lobbyId: 'lobby-123' })
    mockUseSearchParams.mockReturnValue([new URLSearchParams('sessionId=session-123'), vi.fn()])
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

  describe('Lobby Flow', () => {
    it('displays lobby information and allows actions', () => {
      render(<QuizLobbyPage />)

      expect(screen.getByTestId('lobby-header')).toBeInTheDocument()
      expect(screen.getByTestId('lobby-participants')).toBeInTheDocument()
      expect(screen.getByTestId('lobby-actions')).toBeInTheDocument()
    })

    it('handles lobby cancellation', () => {
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

    it('handles leaving lobby', () => {
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

    it('shows start button when conditions are met', () => {
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
  })

  describe('Live Session Flow', () => {
    beforeEach(() => {
      mockUseLiveSessionState.mockReturnValue({
        data: {
          id: 'session-123',
          status: 'RUNNING',
          currentIndex: 0,
          totalQuestions: 5,
          question: mockQuestion,
          you: { score: 0, answered: false },
        },
        isLoading: false,
        isError: false,
      })
      mockUseSubmitLiveAnswer.mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      })
      mockUseLiveEvents.mockReturnValue(undefined)
    })

    it('displays live quiz session', () => {
      render(<LiveSessionPage />)

      expect(screen.getByText('Live-Quiz')).toBeInTheDocument()
      expect(screen.getByText(mockQuestion.questionText)).toBeInTheDocument()
      expect(screen.getByText('Frage 1 / 5')).toBeInTheDocument()
    })

    it('handles answer submission', () => {
      const mockSubmitMutate = vi.fn()
      mockUseSubmitLiveAnswer.mockReturnValue({
        mutate: mockSubmitMutate,
        isPending: false,
      })

      render(<LiveSessionPage />)

      const firstAnswer = screen.getByText(mockQuestion.answers[0].text)
      fireEvent.click(firstAnswer)

      expect(mockSubmitMutate).toHaveBeenCalledWith({
        questionIndex: 0,
        answerId: mockQuestion.answers[0].id,
      })
    })

    it('shows countdown state', () => {
      mockUseLiveSessionState.mockReturnValue({
        data: {
          id: 'session-123',
          status: 'COUNTDOWN',
          startAt: new Date(Date.now() + 5000).toISOString(),
          currentIndex: 0,
          totalQuestions: 5,
          you: { score: 0, answered: false },
        },
        isLoading: false,
        isError: false,
      })

      render(<LiveSessionPage />)

      expect(screen.getByText('Start in')).toBeInTheDocument()
    })

    it('shows finished state', () => {
      mockUseLiveSessionState.mockReturnValue({
        data: {
          id: 'session-123',
          status: 'FINISHED',
          currentIndex: 4,
          totalQuestions: 5,
          you: { score: 85, answered: false },
        },
        isLoading: false,
        isError: false,
      })

      render(<LiveSessionPage />)

      expect(screen.getByText('Quiz beendet')).toBeInTheDocument()
      expect(screen.getByText('Dein Score: 85')).toBeInTheDocument()
    })

    it('handles loading state', () => {
      mockUseLiveSessionState.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      })

      render(<LiveSessionPage />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('handles error state', () => {
      mockUseLiveSessionState.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      })

      render(<LiveSessionPage />)

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/quizzes')
    })
  })
})
