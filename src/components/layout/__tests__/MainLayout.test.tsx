import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import MainLayout from '../MainLayout'

// Mock the child components
vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

vi.mock('../AppBar', () => ({
  default: () => <div data-testid="app-bar">App Bar</div>
}))

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

// Mock Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>
  }
})

describe('MainLayout', () => {
  it('renders all layout components', () => {
    render(<MainLayout />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('app-bar')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('has correct CSS classes for layout structure', () => {
    render(<MainLayout />)
    
    const mainElement = screen.getByRole('main')
    expect(mainElement).toHaveClass('flex-grow')
    
    const container = screen.getByTestId('outlet').parentElement
    expect(container).toHaveClass('max-w-screen-xl', 'mx-auto', 'py-8', 'px-4', 'sm:px-6', 'lg:px-8')
  })

  it('has proper flex layout structure', () => {
    render(<MainLayout />)
    
    const rootElement = screen.getByTestId('header').closest('div')
    expect(rootElement).toHaveClass('flex', 'flex-col', 'min-h-screen', 'w-full', 'bg-gray-50')
  })
})
