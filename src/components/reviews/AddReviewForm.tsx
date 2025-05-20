
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';

// Form schema
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewFormProps {
  businessId: string;
  onSuccess: () => void;
}

const AddReviewForm = ({ businessId, onSuccess }: AddReviewFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Define form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = form.watch('rating');

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if user already reviewed this business
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('business_id', businessId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let error;
      
      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from('reviews')
          .update({
            rating: values.rating,
            comment: values.comment,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingReview.id);
          
        error = updateError;
      } else {
        // Insert new review
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({
            business_id: businessId,
            user_id: user.id,
            rating: values.rating,
            comment: values.comment,
          });
          
        error = insertError;
      }
      
      if (error) throw error;
      
      // Call the success callback
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <div className="flex justify-center my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => field.onChange(star)}
                    >
                      <Star
                        className={`h-8 w-8 transition-all ${
                          star <= (hoveredRating || field.value)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <div className="text-center text-sm font-medium">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Average"}
                {rating === 4 && "Good"}
                {rating === 5 && "Excellent"}
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your experience with this business..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-festive-500 hover:bg-festive-600"
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddReviewForm;
