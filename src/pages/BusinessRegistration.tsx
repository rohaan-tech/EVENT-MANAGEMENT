
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ServiceCategory } from '@/types/services';
import { useQuery } from '@tanstack/react-query';

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
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Define form schema
const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category_id: z.string().min(1, "Please select a category"),
  contact_email: z.string().email("Please enter a valid email"),
  contact_phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  zip: z.string().min(5, "Please enter a valid zip code"),
  price_range: z.enum(["$", "$$", "$$$", "$$$$"]),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const BusinessRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get service categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*');
      
      if (error) throw error;
      return data as ServiceCategory[];
    }
  });

  // Initialize form
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      description: '',
      contact_email: user?.email || '',
      contact_phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      price_range: '$$',
    }
  });

  const onSubmit = async (data: BusinessFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to register a business",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Fix: Create a properly typed object to match what Supabase expects
      const businessData = {
        name: data.name, 
        description: data.description,
        category_id: data.category_id,
        owner_id: user.id,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        website: data.website || null,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        price_range: data.price_range
      };

      const { error } = await supabase
        .from('businesses')
        .insert(businessData);

      if (error) throw error;

      toast({
        title: "Business registered!",
        description: "Your business has been successfully registered.",
      });

      navigate('/business-dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register business",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Register Your Business | FestiveFeastFind</title>
      </Helmet>

      <div className="container-custom max-w-3xl py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Register Your Business</h1>
          <p className="text-muted-foreground">
            Join our platform and reach more customers looking for your services.
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Business Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your business and services..." 
                          {...field} 
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Range</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select price range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="$">$ (Budget-Friendly)</SelectItem>
                            <SelectItem value="$$">$$ (Moderate)</SelectItem>
                            <SelectItem value="$$$">$$$ (Premium)</SelectItem>
                            <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-medium">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-medium">Location</h3>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-festive-500 hover:bg-festive-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Business"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BusinessRegistration;
