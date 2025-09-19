import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock SockJS
vi.mock('sockjs-client', () => ({
  default: vi.fn(() => ({
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,
    send: vi.fn(),
    close: vi.fn(),
  }))
}))

// Mock @stomp/stompjs
vi.mock('@stomp/stompjs', () => ({
  Client: vi.fn().mockImplementation(() => ({
    webSocketFactory: null,
    connectHeaders: {},
    reconnectDelay: 5000,
    onConnect: null,
    onStompError: null,
    onWebSocketError: null,
    onWebSocketClose: null,
    subscribe: vi.fn(),
    publish: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
    connected: false,
    active: false,
  }))
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      defaults: { headers: { common: {} } },
    })),
  },
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  }
})

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
      clear: vi.fn(),
    })),
    QueryClient: vi.fn(),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})
