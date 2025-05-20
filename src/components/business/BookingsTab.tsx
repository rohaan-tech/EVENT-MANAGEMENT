import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Booking } from '@/types/services';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Loader2, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BookingsTabProps {
  businessId: string;
}

const BookingsTab = ({ businessId }: BookingsTabProps) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['businessBookings', businessId, activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id(
            full_name,
            email
          )
        `)
        .eq('business_id', businessId)
        .eq('status', activeTab)
        .order('event_date', { ascending: activeTab !== 'pending' });
      
      if (error) throw error;
      return data as unknown as Booking[];
    }
  });

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: "Booking updated",
        description: `Booking has been ${status}`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold">Booking Requests</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 sm:mt-0">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-festive-500" />
          </div>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No {activeTab} bookings</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab === 'pending' 
                ? 'You have no pending booking requests at the moment.' 
                : `You don't have any ${activeTab} bookings yet.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.profiles?.full_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{booking.profiles?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{booking.event_type || 'Not specified'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(new Date(booking.event_date), 'MMM d, yyyy')}
                      </div>
                      {booking.event_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-3.5 w-3.5" />
                          {booking.event_time}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        {booking.guest_count || 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                          >
                            {updatingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            <span>Accept</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                          >
                            {updatingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            <span>Decline</span>
                          </Button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-blue-200 hover:bg-blue-50"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            disabled={updatingId === booking.id}
                          >
                            {updatingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            <span>Mark Completed</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            <span>Cancel</span>
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsTab;
