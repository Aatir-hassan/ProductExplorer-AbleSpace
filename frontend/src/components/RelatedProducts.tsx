'use client'

import { useEffect, useState } from 'react'
import { api, Product } from '@/lib/api'

import { Loader2, Package } from 'lucide-react'
import { ProductCard } from './ProductCard'


interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        // For now, we'll fetch some random products as related
        // In a real implementation, this would use ML or similarity algorithms
        const data = await api.getProducts(undefined, undefined, 1, 4)
        setProducts(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related products')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [productId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No related products found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Products</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode="list" />
        ))}
      </div>
    </div>
  )
}