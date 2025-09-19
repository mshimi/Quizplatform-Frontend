import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useModules, useToggleFollow } from '../useModuleQueries'
import { mockModule } from '../../test/test-utils'

// Mock the service
const mockGetModules = vi.fn()
const mockToggleFollow = vi.fn()

vi.mock('../../service/moduleService', () => ({
  getModules: mockGetModules,
  toggleFollow: mockToggleFollow,
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

describe('useModules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useQuery with correct parameters', () => {
    const queryParams = { page: 0, size: 10, title: 'test' }
    
    mockUseQuery.mockReturnValue({
      data: { content: [mockModule], totalPages: 1 },
      isLoading: false,
      isError: false,
    })

    renderHook(() => useModules(queryParams), {
      wrapper: createWrapper(),
    })

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['modules', queryParams],
      queryFn: expect.any(Function),
    })
  })

  it('returns query data correctly', () => {
    const mockData = { content: [mockModule], totalPages: 1 }
    
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    })

    const { result } = renderHook(() => useModules({ page: 0, size: 10 }), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('handles loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })

    const { result } = renderHook(() => useModules({ page: 0, size: 10 }), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('handles error state', () => {
    const mockError = new Error('Failed to fetch modules')
    
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    })

    const { result } = renderHook(() => useModules({ page: 0, size: 10 }), {
      wrapper: createWrapper(),
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toEqual(mockError)
  })
})

describe('useToggleFollow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useMutation with correct parameters', () => {
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })

    renderHook(() => useToggleFollow(), {
      wrapper: createWrapper(),
    })

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationFn: expect.any(Function),
      onSuccess: expect.any(Function),
    })
  })

  it('returns mutation functions', () => {
    const mockMutate = vi.fn()
    
    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })

    const { result } = renderHook(() => useToggleFollow(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
  })

  it('handles pending state', () => {
    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    const { result } = renderHook(() => useToggleFollow(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
  })
})
