
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/services';
import { toast } from '@/hooks/use-toast';

export function useBusinesses(categoryName?: string) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('businesses').select(`
          *,
          service_categories!inner(*)
        `);
        
        if (categoryName) {
          query = query.eq('service_categories.name', categoryName);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setBusinesses(data as any || []);
      } catch (err: any) {
        setError(err);
        toast({
          title: 'Error',
          description: 'Failed to load businesses',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBusinesses();
  }, [categoryName]);
  
  return { businesses, isLoading, error };
}
