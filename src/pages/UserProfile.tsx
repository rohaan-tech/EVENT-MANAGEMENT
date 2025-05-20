
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types/auth';
import { useQuery } from '@tanstack/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, CheckCircle } from 'lucide-react';

// Form schema
const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's profile
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
  });

  // Fetch user's bookings
  const { data: bookings } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          businesses (
            id,
            name,
            price_range,
            rating
          )
        `)
        .eq('user_id', user.id)
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      avatar_url: '',
    },
  });
  
  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(data);
      
      if (result.error) throw result.error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
      </div>
    );
  }

  // Handle status badge display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded">Pending</span>;
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded">Confirmed</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded">{status}</span>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Profile | FestiveFeastFind</title>
      </Helmet>

      <div className="bg-gradient-to-br from-festive-50 to-white py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/avatar.jpg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Email</FormLabel>
                        <Input 
                          value={profile?.email || user?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-festive-500 hover:bg-festive-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    View and manage your service bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!bookings || bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Bookings Yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        You haven't made any bookings yet. Find services and make your first booking!
                      </p>
                      <Button 
                        className="mt-4 bg-festive-500 hover:bg-festive-600"
                        onClick={() => window.location.href = '/'}
                      >
                        Browse Services
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <div 
                          key={booking.id}
                          className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                            <div>
                              <h3 className="font-semibold">
                                {booking.businesses?.name || "Unknown Business"}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                {new Date(booking.event_date).toLocaleDateString()} {booking.event_time && `at ${booking.event_time}`}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div>{booking.event_type}</div>
                              {getStatusBadge(booking.status)}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Guests:</span> {booking.guest_count}
                            </div>
                            {booking.businesses?.price_range && (
                              <div>
                                <span className="font-medium">Price Range:</span> {booking.businesses.price_range}
                              </div>
                            )}
                          </div>
                          {booking.special_requests && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Special requests:</span> {booking.special_requests}
                            </div>
                          )}
                          
                          {booking.status === 'pending' && (
                            <div className="mt-3 text-sm flex items-center text-amber-600">
                              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                              Waiting for confirmation from the service provider
                            </div>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <div className="mt-3 text-sm flex items-center text-green-600">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Your booking has been confirmed
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
