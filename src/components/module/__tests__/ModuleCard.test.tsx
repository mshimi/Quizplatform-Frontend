import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../../test/test-utils'
import ModuleCard from '../ModuleCard'
import { mockModule } from '../../../test/test-utils'

describe('ModuleCard', () => {
  const mockOnToggleFollow = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders module information correctly', () => {
    render(
      <ModuleCard
        module={mockModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={false}
      />
    )

    expect(screen.getByText(mockModule.title)).toBeInTheDocument()
    expect(screen.getByText(mockModule.description)).toBeInTheDocument()
    expect(screen.getByText(`${mockModule.questionCount} Fragen`)).toBeInTheDocument()
  })

  it('shows follow button when not following', () => {
    render(
      <ModuleCard
        module={mockModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={false}
      />
    )

    const followButton = screen.getByRole('button', { name: /folgen/i })
    expect(followButton).toBeInTheDocument()
    expect(followButton).not.toBeDisabled()
  })

  it('shows unfollow button when following', () => {
    const followedModule = { ...mockModule, isFollowed: true }
    
    render(
      <ModuleCard
        module={followedModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={false}
      />
    )

    const unfollowButton = screen.getByRole('button', { name: /nicht mehr folgen/i })
    expect(unfollowButton).toBeInTheDocument()
  })

  it('calls onToggleFollow when follow button is clicked', () => {
    render(
      <ModuleCard
        module={mockModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={false}
      />
    )

    const followButton = screen.getByRole('button', { name: /folgen/i })
    fireEvent.click(followButton)

    expect(mockOnToggleFollow).toHaveBeenCalledWith(mockModule.id)
  })

  it('disables button when toggling', () => {
    render(
      <ModuleCard
        module={mockModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={true}
      />
    )

    const followButton = screen.getByRole('button', { name: /folgen/i })
    expect(followButton).toBeDisabled()
  })

  it('shows loading state when toggling', () => {
    render(
      <ModuleCard
        module={mockModule}
        onToggleFollow={mockOnToggleFollow}
        isToggling={true}
      />
    )

    // Check for loading spinner or disabled state
    const followButton = screen.getByRole('button', { name: /folgen/i })
    expect(followButton).toBeDisabled()
  })

  it('formats question count correctly', () => {
    const moduleWithManyQuestions = { ...mockModule, questionCount: 1 }
    
    render(
      <ModuleCard
        module={moduleWithManyQuestions}
        onToggleFollow={mockOnToggleFollow}
        isToggling={false}
      />
    )

    expect(screen.getByText('1 Frage')).toBeInTheDocument()
  })
})
