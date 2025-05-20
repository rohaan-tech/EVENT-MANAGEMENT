
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import EventManagement from "./pages/EventManagement";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessDashboard from "./pages/BusinessDashboard";
import Catering from "./pages/Catering";
import BusinessDetails from "./pages/BusinessDetails";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/signup" element={<Auth />} />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
            <Route path="/register-business" element={
              <ProtectedRoute>
                <BusinessRegistration />
              </ProtectedRoute>
            } />
            <Route path="/business-dashboard" element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
