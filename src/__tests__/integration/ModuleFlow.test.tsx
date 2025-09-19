import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import ExploreModulesPage from '../pages/ExploreModulesPage'
import { mockModule, mockUser } from '../../test/test-utils'

// Mock the hooks
const mockUseModules = vi.fn()
const mockUseToggleFollow = vi.fn()

vi.mock('../../hooks/useModuleQueries', () => ({
  useModules: () => mockUseModules(),
  useToggleFollow: () => mockUseToggleFollow(),
}))

// Mock child components
vi.mock('../../components/module/ModuleCard', () => ({
  default: ({ module, onToggleFollow, isToggling }: any) => (
    <div data-testid={`module-card-${module.id}`}>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      <button 
        onClick={() => onToggleFollow(module.id)}
        disabled={isToggling}
        data-testid={`follow-button-${module.id}`}
      >
        {module.isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}))

vi.mock('../../components/module/FilterBar', () => ({
  default: ({ setSearchTerm, setFilters }: any) => (
    <div data-testid="filter-bar">
      <input 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search modules..."
        data-testid="search-input"
      />
      <select 
        onChange={(e) => setFilters({ followed: e.target.value === 'followed' ? true : null })}
        data-testid="follow-filter"
      >
        <option value="">All</option>
        <option value="followed">Followed</option>
      </select>
    </div>
  )
}))

describe('Module Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseModules.mockReturnValue({
      data: {
        content: [mockModule],
        totalPages: 1,
        totalElements: 1,
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    })

    mockUseToggleFollow.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
    })
  })

  it('displays modules and allows following', async () => {
    render(<ExploreModulesPage />)

    // Should display the module
    expect(screen.getByText(mockModule.title)).toBeInTheDocument()
    expect(screen.getByText(mockModule.description)).toBeInTheDocument()

    // Should show follow button
    const followButton = screen.getByTestId(`follow-button-${mockModule.id}`)
    expect(followButton).toHaveTextContent('Follow')
  })

  it('handles search functionality', async () => {
    render(<ExploreModulesPage />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'test search' } })

    // Wait for debounced search
    await waitFor(() => {
      expect(searchInput).toHaveValue('test search')
    })
  })

  it('handles filter changes', async () => {
    render(<ExploreModulesPage />)

    const followFilter = screen.getByTestId('follow-filter')
    fireEvent.change(followFilter, { target: { value: 'followed' } })

    // The filter should be applied
    expect(followFilter).toHaveValue('followed')
  })

  it('handles follow toggle', async () => {
    const mockMutate = vi.fn()
    mockUseToggleFollow.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
    })

    render(<ExploreModulesPage />)

    const followButton = screen.getByTestId(`follow-button-${mockModule.id}`)
    fireEvent.click(followButton)

    expect(mockMutate).toHaveBeenCalledWith(mockModule.id)
  })

  it('shows loading state during follow toggle', () => {
    mockUseToggleFollow.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: true,
    })

    render(<ExploreModulesPage />)

    const followButton = screen.getByTestId(`follow-button-${mockModule.id}`)
    expect(followButton).toBeDisabled()
  })

  it('handles error state', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    expect(screen.getByText('Module konnten nicht geladen werden.')).toBeInTheDocument()
  })

  it('handles empty state', () => {
    mockUseModules.mockReturnValue({
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    expect(screen.getByText('Keine Module für die aktuellen Filter gefunden.')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    // Should show loading skeletons
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles background fetching', () => {
    mockUseModules.mockReturnValue({
      data: {
        content: [mockModule],
        totalPages: 1,
        totalElements: 1,
      },
      isLoading: false,
      isError: false,
      isFetching: true,
    })

    render(<ExploreModulesPage />)

    // Should show loading overlay
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
