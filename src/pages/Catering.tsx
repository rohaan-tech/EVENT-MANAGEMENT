
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Business } from '@/types/services';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { MapPin, Star, Search, Filter, User, Calendar, Users, ChefHat, Phone, Mail, Globe, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/booking/BookingForm';
import ReviewList from '@/components/reviews/ReviewList';
import AddReviewForm from '@/components/reviews/AddReviewForm';

const Catering = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch catering businesses
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['cateringBusinesses', searchTerm, priceFilter, ratingFilter],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('*, service_categories!inner(*)')
        .eq('service_categories.name', 'Catering');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (priceFilter) {
        query = query.eq('price_range', priceFilter);
      }

      if (ratingFilter) {
        query = query.gte('rating', ratingFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Business[];
    }
  });

  const handleOpenDetails = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleCloseDetails = () => {
    setSelectedBusiness(null);
    setActiveTab('details');
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to book this service",
        variant: "destructive",
      });
      return navigate('/auth');
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
      return navigate('/auth');
    }
    
    setReviewOpen(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 fill-[50%]" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <>
      <Helmet>
        <title>Catering Services | FestiveFeastFind</title>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-festive-500 to-festive-600 py-16 text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catering Services</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Find the perfect catering service for your next event. From intimate gatherings to grand celebrations, discover experienced caterers to create memorable dining experiences.
          </p>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-white py-4 shadow-sm sticky top-0 z-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search caterers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="rounded-md border border-input px-3 py-2 text-sm shadow-sm"
                value={priceFilter || ''}
                onChange={(e) => setPriceFilter(e.target.value || null)}
              >
                <option value="">All Prices</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Premium)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
              <select 
                className="rounded-md border border-input px-3 py-2 text-sm shadow-sm"
                value={ratingFilter || ''}
                onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Businesses List */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-md mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : businesses?.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <h2 className="text-2xl font-bold">No caterers found</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                We couldn't find any catering services matching your criteria. Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses?.map((business) => (
                <Card key={business.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-slate-200 relative">
                    {business.cover_image ? (
                      <img 
                        src={business.cover_image} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <ChefHat className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                    {business.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg line-clamp-1">{business.name}</h3>
                      <div className="text-sm font-medium">
                        {business.price_range || '$$'}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 mb-3">
                      <div className="flex mr-1">
                        {renderStars(business.rating || 0)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({business.rating?.toFixed(1) || '0.0'})
                      </span>
                    </div>
                    
                    {business.city && business.state && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {business.city}, {business.state}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {business.description || 'No description available.'}
                    </p>
                    
                    <Button 
                      onClick={() => handleOpenDetails(business)}
                      className="w-full bg-festive-500 hover:bg-festive-600"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Business Details Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBusiness && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedBusiness.name}</DialogTitle>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {renderStars(selectedBusiness.rating || 0)}
                  </div>
                  <span className="text-sm">
                    {selectedBusiness.rating?.toFixed(1) || '0.0'} rating
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-sm font-medium">
                    {selectedBusiness.price_range || '$$'}
                  </span>
                </div>
              </DialogHeader>

              <div className="mt-2 h-56 sm:h-72 bg-slate-200 rounded-md overflow-hidden">
                {selectedBusiness.cover_image ? (
                  <img 
                    src={selectedBusiness.cover_image} 
                    alt={selectedBusiness.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <ChefHat className="h-16 w-16 text-slate-300" />
                  </div>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mt-4">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">About</h4>
                      <p className="text-muted-foreground">
                        {selectedBusiness.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          {selectedBusiness.address && (
                            <div>{selectedBusiness.address}</div>
                          )}
                          {selectedBusiness.city && selectedBusiness.state && (
                            <div>
                              {selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        {selectedBusiness.contact_email && (
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                            <a 
                              href={`mailto:${selectedBusiness.contact_email}`} 
                              className="text-festive-600 hover:underline"
                            >
                              {selectedBusiness.contact_email}
                            </a>
                          </div>
                        )}
                        {selectedBusiness.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                            <a 
                              href={`tel:${selectedBusiness.contact_phone}`} 
                              className="text-festive-600 hover:underline"
                            >
                              {selectedBusiness.contact_phone}
                            </a>
                          </div>
                        )}
                        {selectedBusiness.website && (
                          <div className="flex items-center">
                            <Globe className="h-5 w-5 text-muted-foreground mr-2" />
                            <a 
                              href={selectedBusiness.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-festive-600 hover:underline"
                            >
                              {selectedBusiness.website.replace(/^https?:\/\//i, '')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <ReviewList businessId={selectedBusiness.id} />
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-6">
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
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Form Dialog */}
      {selectedBusiness && (
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Book {selectedBusiness.name}</DialogTitle>
              <DialogDescription>
                Fill out the form below to book this catering service.
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
              businessId={selectedBusiness.id} 
              onSuccess={() => {
                setBookingOpen(false);
                toast({
                  title: "Booking Submitted",
                  description: "Your booking request has been sent to the caterer.",
                });
              }} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Review Dialog */}
      {selectedBusiness && (
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Review {selectedBusiness.name}</DialogTitle>
              <DialogDescription>
                Share your experience with this catering service.
              </DialogDescription>
            </DialogHeader>
            <AddReviewForm 
              businessId={selectedBusiness.id}
              onSuccess={() => {
                setReviewOpen(false);
                toast({
                  title: "Review Submitted",
                  description: "Thanks for sharing your feedback!",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Catering;
