import Link from 'next/link'
import { Category } from '@/lib/api'
import { ChevronRight, Package } from 'lucide-react'

interface CategoryCardProps {
  category: Category
  viewMode: 'grid' | 'list'
}

export function CategoryCard({ category, viewMode }: CategoryCardProps) {
  if (viewMode === 'list') {
    return (
      <Link
        href={`/products?category=${category.id}`}
        className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500">
                {category.product_count} products
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/products?category=${category.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
    >
      <div className="text-center">
        <div className="bg-blue-100 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Package className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {category.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {category.product_count} products
        </p>
        <p className="text-xs text-gray-400">
          Last updated: {new Date(category.last_scraped_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}