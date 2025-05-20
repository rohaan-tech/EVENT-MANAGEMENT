
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form schema
const bookingSchema = z.object({
  event_date: z.date({
    required_error: "Please select a date",
  }).refine(date => date >= new Date(), {
    message: "Event date must be in the future",
  }),
  event_time: z.string().optional(),
  event_type: z.string().min(1, "Please specify event type"),
  guest_count: z.coerce.number().min(1, "Guest count must be at least 1"),
  special_requests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  businessId: string;
  onSuccess: () => void;
}

const BookingForm = ({ businessId, onSuccess }: BookingFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      event_date: undefined,
      event_time: '',
      event_type: '',
      guest_count: undefined,
      special_requests: '',
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Format the date for storage
      const formattedDate = format(values.event_date, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          business_id: businessId,
          user_id: user.id,
          event_date: formattedDate,
          event_time: values.event_time || null,
          event_type: values.event_type,
          guest_count: values.guest_count, // Now properly typed as number from form values
          special_requests: values.special_requests || null,
          status: 'pending',
        });
      
      if (error) throw error;
      
      // Call the success callback
      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="event_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Time (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="time"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Wedding, Corporate Party, Birthday" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="guest_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Enter number of guests" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any dietary restrictions, special requirements or preferences..."
                  className="resize-none h-24"
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
