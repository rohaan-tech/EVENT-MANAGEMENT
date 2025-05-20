import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Review } from '@/types/services';

import { Star, StarOff, StarHalf, Loader2 } from 'lucide-react';

interface ReviewListProps {
  businessId: string;
}

const ReviewList = ({ businessId }: ReviewListProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['businessReviews', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id(
            full_name,
            avatar_url
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Review[]; // Cast to unknown first to handle any type mismatch
    }
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOff key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No Reviews Yet</h3>
        <p className="text-muted-foreground mt-1">
          Be the first to share your experience with this caterer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="pb-6 border-b last:border-b-0 last:pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden mr-3">
                {review.profiles?.avatar_url ? (
                  <img 
                    src={review.profiles.avatar_url} 
                    alt={review.profiles?.full_name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl text-slate-500">
                    {(review.profiles?.full_name || 'U').charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{review.profiles?.full_name || 'Anonymous User'}</div>
                <div className="flex mt-0.5">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </div>
          </div>
          {review.comment && (
            <div className="mt-3 text-gray-700">
              {review.comment}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
