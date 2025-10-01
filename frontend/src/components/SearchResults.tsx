'use client'

import { useEffect, useState } from 'react'
import { api, Product, Category, PaginatedResponse } from '@/lib/api'
import { ProductCard } from './ProductCard'
import { CategoryCard } from './CategoryCard'
import { Loader2, Package, Filter } from 'lucide-react'

interface SearchResultsProps {
  query: string
  activeTab: 'all' | 'products' | 'categories'
  viewMode: 'grid' | 'list'
}

export function SearchResults({ query, activeTab, viewMode }: SearchResultsProps) {
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null)
  const [categories, setCategories] = useState<PaginatedResponse<Category> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return

      try {
        setLoading(true)
        setError(null)

        if (activeTab === 'all' || activeTab === 'products') {
          const productData = await api.getProducts(undefined, query, 1, 20)
          setProducts(productData)
        }

        if (activeTab === 'all' || activeTab === 'categories') {
          const categoryData = await api.getCategories(undefined, undefined, 1, 20)
          // Filter categories by search query
          const filteredCategories = {
            ...categoryData,
            data: categoryData.data.filter(cat => 
              cat.title.toLowerCase().includes(query.toLowerCase())
            )
          }
          setCategories(filteredCategories)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch search results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, activeTab])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Searching...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Search failed</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const hasResults = () => {
    if (activeTab === 'products') return products && products.data.length > 0
    if (activeTab === 'categories') return categories && categories.data.length > 0
    return (products && products.data.length > 0) || (categories && categories.data.length > 0)
  }

  if (!hasResults()) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Filter className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">No results found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Products Results */}
      {(activeTab === 'all' || activeTab === 'products') && products && products.data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Products ({products.total})
          </h2>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        </div>
      )}

      {/* Categories Results */}
      {(activeTab === 'all' || activeTab === 'categories') && categories && categories.data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Categories ({categories.data.length})
          </h2>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {categories.data.map((category) => (
              <CategoryCard key={category.id} category={category} viewMode={viewMode} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}