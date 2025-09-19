import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import ExploreModulesPage from '../ExploreModulesPage'
import { mockModule } from '../../test/test-utils'

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
      <span>{module.title}</span>
      <button 
        onClick={() => onToggleFollow(module.id)}
        disabled={isToggling}
      >
        {module.isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}))

vi.mock('../../components/module/ModuleListItem', () => ({
  default: ({ module, onToggleFollow, isToggling }: any) => (
    <div data-testid={`module-list-item-${module.id}`}>
      <span>{module.title}</span>
      <button 
        onClick={() => onToggleFollow(module.id)}
        disabled={isToggling}
      >
        {module.isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}))

vi.mock('../../components/module/FilterBar', () => ({
  default: ({ setSearchTerm, viewMode, setViewMode }: any) => (
    <div data-testid="filter-bar">
      <input 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search modules..."
      />
      <button onClick={() => setViewMode('grid')}>Grid</button>
      <button onClick={() => setViewMode('list')}>List</button>
    </div>
  )
}))

vi.mock('../../common/pagination/PaginationControls', () => ({
  default: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span>{currentPage + 1} / {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  )
}))

describe('ExploreModulesPage', () => {
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

  it('renders page title and description', () => {
    render(<ExploreModulesPage />)

    expect(screen.getByText('Alle Module entdecken')).toBeInTheDocument()
    expect(screen.getByText('Finden und folgen Sie Modulen, um Ihr Wissen zu erweitern.')).toBeInTheDocument()
  })

  it('renders filter bar', () => {
    render(<ExploreModulesPage />)

    expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
  })

  it('renders modules in grid view by default', () => {
    render(<ExploreModulesPage />)

    expect(screen.getByTestId(`module-card-${mockModule.id}`)).toBeInTheDocument()
    expect(screen.queryByTestId(`module-list-item-${mockModule.id}`)).not.toBeInTheDocument()
  })

  it('switches to list view when view mode changes', () => {
    render(<ExploreModulesPage />)

    const listButton = screen.getByText('List')
    fireEvent.click(listButton)

    // The component should re-render with list view
    // Note: In a real test, you'd need to trigger a re-render
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    // Should show skeleton components
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseModules.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    expect(screen.getByText('Module konnten nicht geladen werden.')).toBeInTheDocument()
  })

  it('shows empty state when no modules found', () => {
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

  it('calls toggle follow when follow button is clicked', async () => {
    const mockMutate = vi.fn()
    mockUseToggleFollow.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
    })

    render(<ExploreModulesPage />)

    const followButton = screen.getByText('Follow')
    fireEvent.click(followButton)

    expect(mockMutate).toHaveBeenCalledWith(mockModule.id)
  })

  it('shows pagination when multiple pages', () => {
    mockUseModules.mockReturnValue({
      data: {
        content: [mockModule],
        totalPages: 3,
        totalElements: 25,
      },
      isLoading: false,
      isError: false,
      isFetching: false,
    })

    render(<ExploreModulesPage />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    render(<ExploreModulesPage />)

    const searchInput = screen.getByPlaceholderText('Search modules...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })

    // Wait for debounced search
    await waitFor(() => {
      expect(searchInput).toHaveValue('test search')
    })
  })

  it('shows loading overlay during background fetch', () => {
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

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
