import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/api'
import { Star, ExternalLink } from 'lucide-react'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (viewMode === 'list') {
    return (
      <Link
        href={`/products/${product.id}`}
        className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
      >
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {product.title}
            </h3>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {formatPrice(product.price, product.currency)}
            </p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.5)</span>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200"
    >
      <div className="relative aspect-square">
        <Image
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xl font-bold text-blue-600 mb-2">
          {formatPrice(product.price, product.currency)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">(4.5)</span>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
    </Link>
  )
}