'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, Product, ProductDetail, Review } from '@/lib/api'
import { ProductDetailCard } from '@/components/ProductDetailCard'
import { ProductReviews } from '@/components/ProductReviews'
import { RelatedProducts } from '@/components/RelatedProducts'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product & { detail?: ProductDetail; reviews?: Review[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProduct(productId)
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading product...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Failed to load product</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-gray-900">Product not found</p>
          <Link
            href="/products"
            className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductDetailCard product={product} />
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-8">
              <ProductReviews reviews={product.reviews} />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <RelatedProducts productId={product.id} />
        </div>
      </div>
    </div>
  )
}