
import React from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Globe, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export default function EventManagement() {
  const { businesses, isLoading } = useBusinesses("Event Management");
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section for Event Management */}
      <div className="relative py-20 bg-gradient-to-br from-festive-100 to-festive-50">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-festive-900 mb-6">
              Event Management Services
            </h1>
            <p className="text-xl text-festive-800 mb-8">
              Find trusted event planners for weddings, corporate events, and special celebrations. Let professionals handle the details while you enjoy your event.
            </p>
            {!user && (
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-festive-600 hover:bg-festive-700">
                  <Link to="/auth">Sign In to Book</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth/signup">Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Available Event Management Services</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Browse our selection of top-rated event planners who can help make your next event a success.
          </p>
          
          {/* Filters section could go here */}
          
          {/* Businesses List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-festive-600"></div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No event planners available</h3>
              <p className="text-muted-foreground mb-8">We're currently expanding our network. Check back soon!</p>
              {user && (
                <Button asChild className="bg-festive-600 hover:bg-festive-700">
                  <Link to="/business/register">Register Your Business</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business.id} className="overflow-hidden card-hover">
                  <div className="relative h-48">
                    {business.cover_image ? (
                      <img 
                        src={business.cover_image} 
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                    {business.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-festive-500">Featured</Badge>
                    )}
                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      {business.price_range && (
                        <Badge variant="outline" className="bg-muted">
                          {business.price_range}
                        </Badge>
                      )}
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{business.rating ? business.rating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-3">{business.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      {business.city && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{[business.city, business.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {business.contact_phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{business.contact_phone}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Globe className="h-4 w-4 mr-1" />
                          <span className="truncate">{business.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="secondary" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Information about Event Management */}
        <div className="bg-muted/50 p-6 rounded-lg mt-12">
          <h3 className="text-2xl font-bold mb-4">Why Hire an Event Planner?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Save time and reduce stress with professional planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Access to vendor networks and exclusive discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Creative ideas and personalized event themes</span>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Budget management and cost control</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Day-of coordination so you can enjoy your event</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-festive-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-festive-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Seamless execution and handling of unexpected issues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
