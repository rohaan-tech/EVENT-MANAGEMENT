
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  category_id: string;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  profile_image: string | null;
  cover_image: string | null;
  is_featured: boolean;
  rating: number;
  price_range: string | null;
  created_at: string;
  updated_at: string;
  service_categories?: ServiceCategory;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Booking {
  id: string;
  business_id: string | null;
  user_id: string | null;
  event_date: string;
  event_time: string | null;
  event_type: string | null;
  guest_count: number | null;
  special_requests: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}
