
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ChefHat, PartyPopper, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const BusinessRegistration = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-festive-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="heading-2 mb-4">Partner With Us</h2>
          <p className="text-lg text-muted-foreground">
            Join our network of trusted service providers and grow your business by connecting with customers looking for your services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="border-festive-200 bg-white/50 backdrop-blur">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Benefits for Business Owners</h3>
                <ul className="space-y-4">
                  {[
                    "Increased visibility to customers actively searching for your services",
                    "Easy-to-use dashboard to manage your bookings and profile",
                    "Secure payment processing with timely disbursements",
                    "Verified business badge to establish trust with customers",
                    "Marketing tools to showcase your portfolio and previous work",
                    "Analytics to track performance and customer engagement"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <BadgeCheck className="h-5 w-5 text-festive-500 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register-business">
                  <Button className="mt-8 bg-festive-500 hover:bg-festive-600">Register Your Business</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-2">Who Can Join?</h3>
            
            {[
              {
                title: "Event Planners",
                description: "Wedding planners, corporate event organizers, party coordinators",
                icon: PartyPopper,
                color: "bg-festive-100 text-festive-800",
              },
              {
                title: "Decorators",
                description: "Event decorators, floral designers, theme specialists",
                icon: PartyPopper,
                color: "bg-feast-100 text-feast-800",
              },
              {
                title: "Caterers",
                description: "Food service providers, buffet specialists, beverage services",
                icon: Utensils,
                color: "bg-blue-100 text-blue-800",
              },
              {
                title: "Professional Chefs",
                description: "Private chefs, specialty cooks, culinary experts",
                icon: ChefHat,
                color: "bg-green-100 text-green-800",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-3 pt-4">
              <span className="text-sm text-muted-foreground">Already registered?</span>
              {user ? (
                <Link to="/business-dashboard">
                  <Button variant="link" className="p-0 h-auto text-festive-500 hover:text-festive-600">Go to your dashboard</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="link" className="p-0 h-auto text-festive-500 hover:text-festive-600">Log in to your account</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessRegistration;
