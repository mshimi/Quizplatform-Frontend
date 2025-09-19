import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as moduleService from '../moduleService'
import { mockModule } from '../../test/test-utils'

// Mock axios
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
}

vi.mock('../api', () => ({
  default: mockAxios,
}))

describe('moduleService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getModules', () => {
    it('fetches modules with default parameters', async () => {
      const mockResponse = {
        data: {
          content: [mockModule],
          totalPages: 1,
          totalElements: 1,
        },
      }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await moduleService.getModules({})

      expect(mockAxios.get).toHaveBeenCalledWith('/modules', {
        params: {
          page: 0,
          size: 10,
          title: undefined,
          followed: undefined,
          sortBy: 'title',
          sortDirection: 'asc',
        },
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('fetches modules with custom parameters', async () => {
      const params = {
        page: 1,
        size: 20,
        title: 'test',
        followed: true,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }
      const mockResponse = {
        data: {
          content: [mockModule],
          totalPages: 1,
          totalElements: 1,
        },
      }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await moduleService.getModules(params)

      expect(mockAxios.get).toHaveBeenCalledWith('/modules', {
        params,
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('handles API errors', async () => {
      const mockError = new Error('Failed to fetch modules')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(moduleService.getModules({})).rejects.toThrow('Failed to fetch modules')
    })
  })

  describe('getModuleById', () => {
    it('fetches module by ID successfully', async () => {
      const moduleId = 'module-123'
      const mockResponse = { data: mockModule }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await moduleService.getModuleById(moduleId)

      expect(mockAxios.get).toHaveBeenCalledWith(`/modules/${moduleId}`)
      expect(result).toEqual(mockModule)
    })

    it('handles module not found error', async () => {
      const moduleId = 'non-existent'
      const mockError = new Error('Module not found')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(moduleService.getModuleById(moduleId)).rejects.toThrow('Module not found')
    })
  })

  describe('toggleFollow', () => {
    it('toggles follow status successfully', async () => {
      const moduleId = 'module-123'
      const mockResponse = { data: { message: 'Follow status updated' } }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await moduleService.toggleFollow(moduleId)

      expect(mockAxios.post).toHaveBeenCalledWith(`/modules/${moduleId}/follow`)
      expect(result).toEqual(mockResponse.data)
    })

    it('handles toggle follow errors', async () => {
      const moduleId = 'module-123'
      const mockError = new Error('Failed to toggle follow')
      mockAxios.post.mockRejectedValue(mockError)

      await expect(moduleService.toggleFollow(moduleId)).rejects.toThrow('Failed to toggle follow')
    })
  })

  describe('getFollowedModules', () => {
    it('fetches followed modules successfully', async () => {
      const mockResponse = {
        data: {
          content: [mockModule],
          totalPages: 1,
          totalElements: 1,
        },
      }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await moduleService.getFollowedModules()

      expect(mockAxios.get).toHaveBeenCalledWith('/modules/followed')
      expect(result).toEqual(mockResponse.data)
    })

    it('handles API errors', async () => {
      const mockError = new Error('Failed to fetch followed modules')
      mockAxios.get.mockRejectedValue(mockError)

      await expect(moduleService.getFollowedModules()).rejects.toThrow('Failed to fetch followed modules')
    })
  })
})
