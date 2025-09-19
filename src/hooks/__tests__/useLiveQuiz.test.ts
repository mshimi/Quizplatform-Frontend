import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLiveSessionState, useSubmitLiveAnswer, useStartLiveSession } from '../useLiveQuiz'

// Mock the service
const mockGetLiveSessionState = vi.fn()
const mockSubmitLiveAnswer = vi.fn()
const mockStartLiveSession = vi.fn()

vi.mock('../../service/liveQuizService', () => ({
  getLiveSessionState: mockGetLiveSessionState,
  submitLiveAnswer: mockSubmitLiveAnswer,
  startLiveSession: mockStartLiveSession,
}))

// Mock useQuery and useMutation
const mockUseQuery = vi.fn()
const mockUseMutation = vi.fn()

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
    return ({ children }: { children: React.ReactNode }) => 
      React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useLiveSessionState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useQuery with correct parameters when sessionId is provided', () => {
    const sessionId = 'session-123'
    const mockSessionState = {
      id: sessionId,
      status: 'RUNNING',
      currentIndex: 0,
      totalQuestions: 5,
      question: {
        id: '1',
        text: 'Test question?',
        answers: [
          { id: '1', text: 'Answer 1' },
          { id: '2', text: 'Answer 2' },
        ],
      },
      you: { score: 0, answered: false },
    }

    mockUseQuery.mockReturnValue({
      data: mockSessionState,
      isLoading: false,
      isError: false,
    })

    renderHook(() => useLiveSessionState(sessionId), {
      wrapper: createWrapper(),
    })

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['live', 'session', sessionId],
      queryFn: expect.any(Function),
      enabled: true,
      refetchOnWindowFocus: false,
    })
  })

  it('disables query when sessionId is not provided', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })

    renderHook(() => useLiveSessionState(undefined), {
      wrapper: createWrapper(),
    })

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['live', 'session', 'nil'],
      queryFn: expect.any(Function),
      enabled: false,
      refetchOnWindowFocus: false,
    })
  })

  it('returns session state data', () => {
    const sessionId = 'session-123'
    const mockSessionState = {
      id: sessionId,
      status: 'RUNNING' as const,
      currentIndex: 0,
      totalQuestions: 5,
    }

    mockUseQuery.mockReturnValue({
      data: mockSessionState,
      isLoading: false,
      isError: false,
    })

    const { result } = renderHook(() => useLiveSessionState(sessionId), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(mockSessionState)
  })
})

describe('useSubmitLiveAnswer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useMutation with correct parameters', () => {
    const sessionId = 'session-123'
    const mockMutate = vi.fn()
    
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    renderHook(() => useSubmitLiveAnswer(sessionId), {
      wrapper: createWrapper(),
    })

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    })
  })

  it('returns mutation functions', () => {
    const sessionId = 'session-123'
    const mockMutate = vi.fn()
    
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    const { result } = renderHook(() => useSubmitLiveAnswer(sessionId), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.mutate).toBe('function')
  })

  it('handles pending state', () => {
    const sessionId = 'session-123'
    
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    const { result } = renderHook(() => useSubmitLiveAnswer(sessionId), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
  })
})

describe('useStartLiveSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useMutation with correct parameters', () => {
    const mockMutate = vi.fn()
    
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    renderHook(() => useStartLiveSession(), {
      wrapper: createWrapper(),
    })

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
    })
  })

  it('returns mutation functions', () => {
    const mockMutate = vi.fn()
    
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    const { result } = renderHook(() => useStartLiveSession(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.mutate).toBe('function')
  })
})
