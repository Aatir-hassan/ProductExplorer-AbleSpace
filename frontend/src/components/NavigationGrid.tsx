'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api, Navigation } from '@/lib/api'
import { BookOpen, ChevronRight, Loader2, RefreshCw } from 'lucide-react'

export function NavigationGrid() {
  const [navigation, setNavigation] = useState<Navigation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNavigation = async () => {
    try {
      setError(null)
      const data = await api.getNavigation()
      setNavigation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch navigation')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await api.triggerNavigationScrape()
      // Wait a bit for the scrape to complete, then refetch
      setTimeout(() => {
        fetchNavigation()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger refresh')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNavigation()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading navigation...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <BookOpen className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Failed to load navigation</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchNavigation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Categories</h2>
          <p className="text-gray-600">
            Explore products organized by categories from World of Books
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </button>
      </div>

      {navigation.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No navigation data available</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Navigation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={`/categories?navigation=${item.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(item.last_scraped_at).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}