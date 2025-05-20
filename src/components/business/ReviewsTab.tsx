import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Review } from '@/types/services';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2, StarHalf, StarOff } from 'lucide-react';

interface ReviewsTabProps {
  businessId: string;
}

const ReviewsTab = ({ businessId }: ReviewsTabProps) => {
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

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => {
      if (i < Math.floor(rating)) {
        return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
      } else {
        return <StarOff key={i} className="h-4 w-4 text-gray-300" />;
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
          </div>
        ) : (
          <>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="flex items-center mt-1">
                    <span className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                    <div className="flex">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="text-sm text-muted-foreground mb-1">
                    Based on {reviews?.length || 0} review{reviews?.length === 1 ? '' : 's'}
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {reviews?.filter(r => r.rating >= 4).length || 0} positive
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {reviews?.filter(r => r.rating === 3).length || 0} neutral
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {reviews?.filter(r => r.rating < 3).length || 0} negative
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {reviews?.length === 0 ? (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">No Reviews Yet</h3>
                <p className="text-muted-foreground mt-1">
                  Your business hasn't received any reviews yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-start">
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
                          <h4 className="font-medium">{review.profiles?.full_name || 'Anonymous User'}</h4>
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsTab;
