import Image from 'next/image'
import { Product, ProductDetail } from '@/lib/api'
import { Star, ExternalLink, Heart, Share2, ShoppingCart } from 'lucide-react'

interface ProductDetailCardProps {
  product: Product & { detail?: ProductDetail }
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(4.5)</span>
              </div>
              <span className="text-sm text-gray-500">
                {product.detail?.reviews_count || 0} reviews
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          {/* Description */}
          {product.detail?.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.detail.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {product.detail?.specs && Object.keys(product.detail.specs).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.detail.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Link */}
          <div className="pt-4 border-t border-gray-200">
            <a
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on World of Books
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}