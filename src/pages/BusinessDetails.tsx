import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Business } from '@/types/services';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { 
  Map, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Calendar, 
  Loader2,
  ChefHat,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ReviewList from '@/components/reviews/ReviewList';
import AddReviewForm from '@/components/reviews/AddReviewForm';
import BookingForm from '@/components/booking/BookingForm';

const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { data: business, isLoading, isError } = useQuery({
    queryKey: ['businessDetail', id],
    queryFn: async () => {
      if (!id) throw new Error("Business ID is required");

      const { data, error } = await supabase
        .from('businesses')
        .select('*, service_categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Business;
    },
  });

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to book this service",
        variant: "destructive",
      });
      return navigate('/auth', { state: { from: `/business/${id}` } });
    }
    
    setBookingOpen(true);
  };

  const handleWriteReview = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return navigate('/auth', { state: { from: `/business/${id}` } });
    }
    
    setReviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-festive-500" />
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The business you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400 fill-[50%]" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

  const categoryColors: Record<string, string> = {
    'Event Management': 'bg-festive-100 text-festive-800',
    'Decoration Services': 'bg-feast-100 text-feast-800',
    'Catering': 'bg-blue-100 text-blue-800',
    'Private Chef': 'bg-green-100 text-green-800',
    'Venue Booking': 'bg-purple-100 text-purple-800',
  };

  const categoryName = business?.service_categories?.name || 'Other';
  const categoryColor = categoryColors[categoryName] || 'bg-gray-100 text-gray-800';

  return (
    <>
      
      <Helmet>
        <title>{business.name} | FestiveFeastFind</title>
        <meta name="description" content={business.description || `View details and book ${business.name}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative">
        <div className="h-64 md:h-80 bg-slate-200 overflow-hidden">
          {business.cover_image ? (
            <img 
              src={business.cover_image} 
              alt={business.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-festive-300/30 to-festive-500/30">
              <ChefHat className="h-24 w-24 text-festive-200" />
            </div>
          )}
        </div>
        <div className="container-custom">
          <div className="relative -mt-16 flex">
            <div className="h-32 w-32 rounded-xl border-4 border-white bg-white overflow-hidden shadow">
              {business.profile_image ? (
                <img 
                  src={business.profile_image} 
                  alt={business.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <ChefHat className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Info Section */}
      <section className="py-6 md:py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {business.service_categories && (
                  <span className={`text-sm px-3 py-1 rounded-full ${categoryColor}`}>
                    {categoryName}
                  </span>
                )}
                {business.is_featured && (
                  <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold">{business.name}</h1>
              
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {renderStars(business.rating || 0)}
                </div>
                <span className="text-lg">
                  {business.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-lg font-medium">
                  {business.price_range || '$$'}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={handleWriteReview}
              >
                <Star className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
              <Button 
                onClick={handleBookNow}
                className="bg-festive-500 hover:bg-festive-600"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-3">About</h2>
                      <p className="text-muted-foreground">
                        {business.description || 'No description available.'}
                      </p>
                    </div>
                    
                    {/* Additional sections can be added here */}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        {business.contact_phone && (
                          <div className="flex">
                            <Phone className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Phone</div>
                              <a 
                                href={`tel:${business.contact_phone}`} 
                                className="text-festive-600 hover:underline"
                              >
                                {business.contact_phone}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {business.contact_email && (
                          <div className="flex">
                            <Mail className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Email</div>
                              <a 
                                href={`mailto:${business.contact_email}`} 
                                className="text-festive-600 hover:underline break-words"
                              >
                                {business.contact_email}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {business.website && (
                          <div className="flex">
                            <Globe className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Website</div>
                              <a 
                                href={business.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-festive-600 hover:underline break-words"
                              >
                                {business.website.replace(/^https?:\/\//i, '')}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {(business.address || business.city || business.state) && (
                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Location</h3>
                        <div className="flex">
                          <Map className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                          <div>
                            {business.address && (
                              <div>{business.address}</div>
                            )}
                            {business.city && business.state && (
                              <div>
                                {business.city}, {business.state} {business.zip}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-3">
                    <ReviewList businessId={business.id} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Booking Form Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book {business.name}</DialogTitle>
            <DialogDescription>
              Fill out the form below to book this service.
            </DialogDescription>
          </DialogHeader>
          <BookingForm 
            businessId={business.id} 
            onSuccess={() => {
              setBookingOpen(false);
              toast({
                title: "Booking Submitted",
                description: "Your booking request has been sent. You'll be notified when the business responds.",
              });
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review {business.name}</DialogTitle>
            <DialogDescription>
              Share your experience with this business.
            </DialogDescription>
          </DialogHeader>
          <AddReviewForm 
            businessId={business.id}
            onSuccess={() => {
              setReviewOpen(false);
              toast({
                title: "Review Submitted",
                description: "Thanks for sharing your feedback!",
              });
              // Refresh reviews
              setActiveTab('reviews');
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessDetails;
