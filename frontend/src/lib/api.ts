import { API_URL } from './utils'

export interface Navigation {
  id: string
  title: string
  slug: string
  last_scraped_at: string
}

export interface Category {
  id: string
  navigation_id: string
  parent_id?: string
  title: string
  slug: string
  product_count: number
  last_scraped_at: string
}

export interface Product {
  id: string
  source_id: string
  title: string
  price: number
  currency: string
  image_url: string
  source_url: string
  last_scraped_at: string
}

export interface ProductDetail {
  product_id: string
  description: string
  specs: Record<string, any>
  ratings_avg: number
  reviews_count: number
}

export interface Review {
  id: string
  product_id: string
  author: string
  rating: number
  text: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API functions
export const api = {
  // Navigation
  getNavigation: async (): Promise<Navigation[]> => {
    const response = await fetch(`${API_URL}/api/navigation`)
    if (!response.ok) throw new Error('Failed to fetch navigation')
    const result: ApiResponse<Navigation[]> = await response.json()
    return result.data
  },

  // Categories
  getCategories: async (navigationId?: string, parentId?: string, page = 1, limit = 20): Promise<PaginatedResponse<Category>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (navigationId) params.append('navigation_id', navigationId)
    if (parentId) params.append('parent_id', parentId)

    const response = await fetch(`${API_URL}/api/categories?${params}`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  },

  // Products
  getProducts: async (categoryId?: string, search?: string, page = 1, limit = 20): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (categoryId) params.append('category_id', categoryId)
    if (search) params.append('search', search)

    const response = await fetch(`${API_URL}/api/products?${params}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  getProduct: async (id: string): Promise<Product & { detail?: ProductDetail; reviews?: Review[] }> => {
    const response = await fetch(`${API_URL}/api/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    const result: ApiResponse<Product & { detail?: ProductDetail; reviews?: Review[] }> = await response.json()
    return result.data
  },

  // Scraping
  triggerNavigationScrape: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/api/scrape/navigation`, { method: 'POST' })
    if (!response.ok) throw new Error('Failed to trigger navigation scrape')
  },

  triggerCategoryScrape: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/scrape/category/${id}`, { method: 'POST' })
    if (!response.ok) throw new Error('Failed to trigger category scrape')
  },

  triggerProductScrape: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/scrape/product/${id}`, { method: 'POST' })
    if (!response.ok) throw new Error('Failed to trigger product scrape')
  },
}