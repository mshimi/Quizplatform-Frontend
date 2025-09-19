# QuizSystem Frontend - Testing Guide

## Overview

This document provides a comprehensive guide to the testing setup and strategy for the QuizSystem frontend application.

## Test Framework

- **Testing Framework**: Vitest
- **Testing Library**: React Testing Library
- **Test Environment**: jsdom
- **Coverage**: v8 provider

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup and mocks
│   ├── test-utils.tsx        # Custom render function and utilities
│   └── README.md             # Detailed testing documentation
├── components/**/__tests__/  # Component tests
├── hooks/__tests__/          # Custom hooks tests
├── service/__tests__/        # Service layer tests
├── pages/__tests__/          # Page component tests
└── __tests__/integration/    # Integration tests
```

## Available Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test:run src/__tests__/simple.test.ts
```

## Test Categories

### 1. Unit Tests

#### Component Tests
- **Location**: `src/components/**/__tests__/`
- **Purpose**: Test individual React components in isolation
- **Examples**:
  - `MainLayout.test.tsx` - Layout component testing
  - `ModuleCard.test.tsx` - Module card component
  - `QuizPlayer.test.tsx` - Quiz player component
  - `LobbyHeader.test.tsx` - Lobby header component

#### Hook Tests
- **Location**: `src/hooks/__tests__/`
- **Purpose**: Test custom React hooks
- **Examples**:
  - `useAuth.test.ts` - Authentication hook
  - `useModuleQueries.test.ts` - Module data fetching
  - `useLiveQuiz.test.ts` - Live quiz functionality

#### Service Tests
- **Location**: `src/service/__tests__/`
- **Purpose**: Test API service functions
- **Examples**:
  - `authService.test.ts` - Authentication service
  - `moduleService.test.ts` - Module management service
  - `websocketService.test.ts` - WebSocket service

### 2. Integration Tests

#### Page Tests
- **Location**: `src/pages/__tests__/`
- **Purpose**: Test complete page components
- **Examples**:
  - `DashboardPage.test.tsx` - Main dashboard
  - `ExploreModulesPage.test.tsx` - Module exploration
  - `QuizLobbyPage.test.tsx` - Quiz lobby management

#### Flow Tests
- **Location**: `src/__tests__/integration/`
- **Purpose**: Test complete user flows
- **Examples**:
  - `AuthFlow.test.tsx` - Authentication flow
  - `ModuleFlow.test.tsx` - Module interaction flow
  - `QuizFlow.test.tsx` - Quiz creation and participation flow

## Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that automatically wraps components with all necessary providers:

```tsx
import { render, screen } from '../test/test-utils'

// This automatically includes:
// - QueryClientProvider
// - BrowserRouter
// - WebSocketProvider
// - AuthProvider
```

### Mock Data

Common mock data is available for consistent testing:

```tsx
import { 
  mockUser, 
  mockModule, 
  mockQuiz, 
  mockLobby, 
  mockQuestion 
} from '../test/test-utils'
```

### Mock Functions

Helper functions for creating test mocks:

```tsx
import { 
  createMockQueryData, 
  createMockMutation 
} from '../test/test-utils'

const mockQueryData = createMockQueryData(mockModule)
const mockMutation = createMockMutation(mockData, mockError)
```

## Testing Patterns

### Component Testing Pattern

```tsx
describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interactions', () => {
    const mockHandler = vi.fn()
    render(<ComponentName onAction={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalledWith(expectedValue)
  })
})
```

### Hook Testing Pattern

```tsx
describe('useCustomHook', () => {
  it('returns expected data', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.data).toEqual(expectedData)
  })
})
```

### Service Testing Pattern

```tsx
describe('serviceName', () => {
  it('calls API with correct parameters', async () => {
    const mockResponse = { data: mockData }
    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await serviceFunction(params)
    
    expect(mockAxios.get).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual(mockData)
  })
})
```

## Mocking Strategy

### Global Mocks (setup.ts)

- **Axios**: HTTP client
- **React Router**: Navigation
- **WebSocket**: Real-time communication
- **TanStack Query**: Data fetching
- **SockJS**: WebSocket transport
- **@stomp/stompjs**: STOMP protocol

### Component Mocks

- Child components are mocked in individual test files
- External libraries are mocked globally
- Context providers are mocked as needed

## Test Coverage

The test suite aims for comprehensive coverage of:

- **Components**: Rendering, user interactions, state changes
- **Hooks**: Data fetching, state management, side effects
- **Services**: API calls, error handling, data transformation
- **Pages**: Complete user flows, navigation, data loading
- **Integration**: End-to-end user scenarios

## Common Test Scenarios

### Loading States
```tsx
it('shows loading state', () => {
  mockUseQuery.mockReturnValue({ isLoading: true })
  render(<Component />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})
```

### Error States
```tsx
it('shows error state', () => {
  mockUseQuery.mockReturnValue({ isError: true })
  render(<Component />)
  expect(screen.getByText('Error message')).toBeInTheDocument()
})
```

### User Interactions
```tsx
it('handles button click', () => {
  const mockHandler = vi.fn()
  render(<Component onAction={mockHandler} />)
  
  fireEvent.click(screen.getByRole('button'))
  expect(mockHandler).toHaveBeenCalledWith(expectedValue)
})
```

### Form Interactions
```tsx
it('handles form submission', () => {
  const mockSubmit = vi.fn()
  render(<Form onSubmit={mockSubmit} />)
  
  fireEvent.change(screen.getByLabelText('Email'), { 
    target: { value: 'test@example.com' } 
  })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(mockSubmit).toHaveBeenCalledWith({ 
    email: 'test@example.com' 
  })
})
```

## Debugging Tests

### Debug Output
```tsx
import { screen } from '@testing-library/react'

// Print DOM structure
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))
```

### Common Queries
```tsx
// Find elements by role
screen.getByRole('button', { name: 'Submit' })

// Find elements by text
screen.getByText('Expected Text')

// Find elements by test id
screen.getByTestId('custom-element')

// Find elements by label
screen.getByLabelText('Email Address')
```

### Async Operations
```tsx
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded Content')).toBeInTheDocument()
})

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
})
```

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock at the right level (not too deep, not too shallow)
- Use `vi.fn()` for functions
- Use `vi.mock()` for modules
- Clean up mocks in `beforeEach`

### 3. Assertions
- Use specific matchers (`toBeInTheDocument`, `toHaveClass`)
- Test both positive and negative cases
- Test edge cases and error states

### 4. Coverage
- Aim for high coverage but focus on meaningful tests
- Test user interactions and business logic
- Don't test implementation details

## Continuous Integration

The test suite is designed to run in CI environments:

- All tests run in headless mode
- Coverage reports are generated
- Tests fail fast on errors
- Parallel execution for performance

## Troubleshooting

### Common Issues

1. **Import Errors**: Check that all imports are correctly mocked
2. **Context Errors**: Ensure providers are properly set up
3. **Async Issues**: Use `waitFor` for async operations
4. **Mock Issues**: Verify mocks are reset in `beforeEach`

### Getting Help

- Check the test output for specific error messages
- Use `screen.debug()` to inspect the DOM
- Verify that mocks are set up correctly
- Check the test setup file for global mocks

## Test Examples

### Working Test
```tsx
// src/__tests__/simple.test.ts
import { describe, it, expect } from 'vitest'

describe('Simple Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

### Component Test
```tsx
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '../../../test/test-utils'
import Button from '../Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Conclusion

This testing setup provides a solid foundation for testing the QuizSystem frontend application. The tests cover components, hooks, services, pages, and integration flows, ensuring the application works correctly and maintains quality as it evolves.

For more detailed information, see the `src/test/README.md` file.
