import { Review } from '@/lib/api'
import { Star, User } from 'lucide-react'

interface ProductReviewsProps {
  reviews: Review[]
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {review.text && (
                <p className="text-gray-700 leading-relaxed">
                  {review.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}