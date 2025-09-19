import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToTopic,
  unsubscribeFromTopic,
  publish,
  sendChatMessage,
  sendQuizInvite,
} from '../websocketService'

// Mock SockJS
const mockSockJS = vi.fn()
vi.mock('sockjs-client', () => ({
  default: mockSockJS,
}))

// Mock @stomp/stompjs
const mockClient = {
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
}

const mockClientConstructor = vi.fn(() => mockClient)
vi.mock('@stomp/stompjs', () => ({
  Client: mockClientConstructor,
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('websocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('mock-token')
  })

  afterEach(() => {
    // Clean up any active connections
    disconnectWebSocket()
  })

  describe('connectWebSocket', () => {
    it('creates client with correct configuration', () => {
      const mockNotificationCallback = vi.fn()
      
      connectWebSocket(mockNotificationCallback)

      expect(mockClientConstructor).toHaveBeenCalledWith({
        webSocketFactory: expect.any(Function),
        connectHeaders: { Authorization: 'Bearer mock-token' },
        reconnectDelay: 5000,
        onConnect: expect.any(Function),
        onStompError: expect.any(Function),
        onWebSocketError: expect.any(Function),
        onWebSocketClose: expect.any(Function),
      })
      expect(mockClient.activate).toHaveBeenCalled()
    })

    it('does not connect if no token is available', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      const mockNotificationCallback = vi.fn()

      connectWebSocket(mockNotificationCallback)

      expect(mockClientConstructor).not.toHaveBeenCalled()
    })

    it('does not create multiple connections', () => {
      const mockNotificationCallback = vi.fn()
      
      connectWebSocket(mockNotificationCallback)
      connectWebSocket(mockNotificationCallback)

      expect(mockClientConstructor).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnectWebSocket', () => {
    it('deactivates client and cleans up', () => {
      const mockNotificationCallback = vi.fn()
      connectWebSocket(mockNotificationCallback)
      
      disconnectWebSocket()

      expect(mockClient.deactivate).toHaveBeenCalled()
    })

    it('handles disconnect when no client exists', () => {
      // Should not throw error
      expect(() => disconnectWebSocket()).not.toThrow()
    })
  })

  describe('subscribeToTopic', () => {
    it('subscribes to topic when connected', () => {
      const mockNotificationCallback = vi.fn()
      const mockCallback = vi.fn()
      
      // Mock connected state
      mockClient.connected = true
      connectWebSocket(mockNotificationCallback)
      
      subscribeToTopic('/topic/test', mockCallback)

      expect(mockClient.subscribe).toHaveBeenCalledWith(
        '/topic/test',
        expect.any(Function)
      )
    })

    it('queues subscription when not connected', () => {
      const mockNotificationCallback = vi.fn()
      const mockCallback = vi.fn()
      
      // Mock disconnected state
      mockClient.connected = false
      connectWebSocket(mockNotificationCallback)
      
      subscribeToTopic('/topic/test', mockCallback)

      // Should not call subscribe immediately
      expect(mockClient.subscribe).not.toHaveBeenCalledWith('/topic/test', expect.any(Function))
    })
  })

  describe('unsubscribeFromTopic', () => {
    it('unsubscribes from topic', () => {
      const mockNotificationCallback = vi.fn()
      const mockCallback = vi.fn()
      
      connectWebSocket(mockNotificationCallback)
      subscribeToTopic('/topic/test', mockCallback)
      
      unsubscribeFromTopic('/topic/test')

      // Should clean up subscription
      expect(mockClient.subscribe).toHaveBeenCalled()
    })
  })

  describe('publish', () => {
    it('publishes message when connected', () => {
      const mockNotificationCallback = vi.fn()
      mockClient.connected = true
      connectWebSocket(mockNotificationCallback)
      
      const message = { test: 'data' }
      publish('/app/test', message)

      expect(mockClient.publish).toHaveBeenCalledWith({
        destination: '/app/test',
        body: JSON.stringify(message),
      })
    })

    it('does not publish when not connected', () => {
      const mockNotificationCallback = vi.fn()
      mockClient.connected = false
      connectWebSocket(mockNotificationCallback)
      
      const message = { test: 'data' }
      publish('/app/test', message)

      expect(mockClient.publish).not.toHaveBeenCalled()
    })
  })

  describe('sendChatMessage', () => {
    it('sends chat message', () => {
      const mockNotificationCallback = vi.fn()
      mockClient.connected = true
      connectWebSocket(mockNotificationCallback)
      
      sendChatMessage('user-123', 'Hello!')

      expect(mockClient.publish).toHaveBeenCalledWith({
        destination: '/app/chat/send',
        body: JSON.stringify({ recipientId: 'user-123', content: 'Hello!' }),
      })
    })
  })

  describe('sendQuizInvite', () => {
    it('sends quiz invite', () => {
      const mockNotificationCallback = vi.fn()
      mockClient.connected = true
      connectWebSocket(mockNotificationCallback)
      
      sendQuizInvite('user-123', 'module-456')

      expect(mockClient.publish).toHaveBeenCalledWith({
        destination: '/app/quiz/invite',
        body: JSON.stringify({ recipientId: 'user-123', moduleId: 'module-456' }),
      })
    })
  })
})
