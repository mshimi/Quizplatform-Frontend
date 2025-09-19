# Testing Guide for QuizSystem Frontend

This directory contains comprehensive tests for the QuizSystem frontend application.

## Test Structure

```
src/test/
├── setup.ts                 # Global test setup and mocks
├── test-utils.tsx          # Custom render function and test utilities
├── README.md               # This file
└── vitest.config.ts        # Vitest configuration for tests

src/components/**/__tests__/  # Component tests
src/hooks/__tests__/         # Custom hooks tests
src/service/__tests__/       # Service layer tests
src/pages/__tests__/         # Page component tests
src/__tests__/integration/   # Integration tests
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Categories

### 1. Component Tests
- **Location**: `src/components/**/__tests__/`
- **Purpose**: Test individual React components in isolation
- **Examples**: MainLayout, ModuleCard, QuizPlayer, LobbyHeader

### 2. Hook Tests
- **Location**: `src/hooks/__tests__/`
- **Purpose**: Test custom React hooks
- **Examples**: useAuth, useModuleQueries, useLiveQuiz

### 3. Service Tests
- **Location**: `src/service/__tests__/`
- **Purpose**: Test API service functions
- **Examples**: authService, moduleService, websocketService

### 4. Page Tests
- **Location**: `src/pages/__tests__/`
- **Purpose**: Test complete page components
- **Examples**: DashboardPage, ExploreModulesPage, QuizLobbyPage

### 5. Integration Tests
- **Location**: `src/__tests__/integration/`
- **Purpose**: Test complete user flows
- **Examples**: AuthFlow, ModuleFlow, QuizFlow

## Test Utilities

### Custom Render Function
The `test-utils.tsx` file provides a custom render function that includes all necessary providers:

```tsx
import { render, screen } from '../test/test-utils'

// This automatically wraps components with:
// - QueryClientProvider
// - BrowserRouter
// - WebSocketProvider
// - AuthProvider
```

### Mock Data
Common mock data is available in `test-utils.tsx`:

```tsx
import { mockUser, mockModule, mockQuiz, mockLobby } from '../test/test-utils'
```

### Mock Functions
Helper functions for creating mocks:

```tsx
import { createMockQueryData, createMockMutation } from '../test/test-utils'

const mockQueryData = createMockQueryData(mockModule)
const mockMutation = createMockMutation(mockData, mockError)
```

## Testing Patterns

### 1. Component Testing
```tsx
describe('ComponentName', () => {
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

### 2. Hook Testing
```tsx
describe('useCustomHook', () => {
  it('returns expected data', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.data).toEqual(expectedData)
  })
})
```

### 3. Service Testing
```tsx
describe('serviceName', () => {
  it('calls API with correct parameters', async () => {
    const mockResponse = { data: mockData }
    mockAxios.get.mockResolvedValue(mockResponse)

    const result = await serviceFunction(params)
    
    expect(mockAxios.get).toHaveBeenCalledWith(expectedUrl, expectedConfig)
    expect(result).toEqual(mockData)
  })
})
```

## Mocking Strategy

### 1. External Dependencies
- **Axios**: Mocked in `setup.ts`
- **React Router**: Mocked in `setup.ts`
- **WebSocket**: Mocked in `setup.ts`
- **TanStack Query**: Mocked in `setup.ts`

### 2. Internal Dependencies
- **Hooks**: Mocked individually in test files
- **Services**: Mocked in `setup.ts` or individual test files
- **Context**: Mocked in `setup.ts`

### 3. Component Dependencies
- **Child Components**: Mocked in individual test files
- **External Libraries**: Mocked in `setup.ts`

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

## Common Test Scenarios

### 1. Loading States
```tsx
it('shows loading state', () => {
  mockUseQuery.mockReturnValue({ isLoading: true })
  render(<Component />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})
```

### 2. Error States
```tsx
it('shows error state', () => {
  mockUseQuery.mockReturnValue({ isError: true })
  render(<Component />)
  expect(screen.getByText('Error message')).toBeInTheDocument()
})
```

### 3. User Interactions
```tsx
it('handles button click', () => {
  const mockHandler = vi.fn()
  render(<Component onAction={mockHandler} />)
  
  fireEvent.click(screen.getByRole('button'))
  expect(mockHandler).toHaveBeenCalledWith(expectedValue)
})
```

### 4. Form Interactions
```tsx
it('handles form submission', () => {
  const mockSubmit = vi.fn()
  render(<Form onSubmit={mockSubmit} />)
  
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
})
```

## Debugging Tests

### 1. Debug Output
```tsx
import { screen } from '@testing-library/react'

// Print DOM structure
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))
```

### 2. Test Queries
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

### 3. Async Operations
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
