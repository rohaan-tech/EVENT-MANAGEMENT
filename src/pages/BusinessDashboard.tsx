
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Settings, 
  Star, 
  Loader2, 
  Edit, 
  Users,
  ListFilter,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import BusinessProfileTab from '@/components/business/BusinessProfileTab';
import BookingsTab from '@/components/business/BookingsTab';
import ReviewsTab from '@/components/business/ReviewsTab';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const {
    data: business,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userBusiness'],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('businesses')
        .select('*, service_categories(*)')
        .eq('owner_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No business found for this user
          return null;
        }
        throw error;
      }

      return data as Business;
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading business profile',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Business Registered</h2>
        <p className="text-muted-foreground mb-6">
          You haven't registered a business yet. Register now to start offering your services.
        </p>
        <Link to="/register-business">
          <Button className="bg-festive-500 hover:bg-festive-600">
            Register Your Business
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Business Dashboard | FestiveFeastFind</title>
      </Helmet>

      <div className="bg-gradient-to-b from-festive-50 to-white py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <p className="text-muted-foreground">
                {business.service_categories?.name} • {business.price_range}
              </p>
            </div>
            <Link to={`/business/${business.id}`} target="_blank">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Public Profile
              </Button>
            </Link>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="profile">
                <Settings className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <CalendarDays className="mr-2 h-4 w-4" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="mr-2 h-4 w-4" /> Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <BusinessProfileTab 
                business={business} 
                onUpdate={refetch}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsTab businessId={business.id} />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsTab businessId={business.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;
