
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, CalendarDays, House, MapPin, PartyPopper, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Event Management",
    description: "Professional planners for weddings, corporate events, and celebrations",
    icon: PartyPopper,
    color: "bg-festive-100 text-festive-800",
    link: "/event-management",
  },
  {
    title: "Decoration Services",
    description: "Creative designers to transform your venues for any occasion",
    icon: CalendarDays,
    color: "bg-feast-100 text-feast-800",
    link: "/decoration",
  },
  {
    title: "Catering",
    description: "Exceptional food service for events of all sizes and cuisines",
    icon: Utensils,
    color: "bg-blue-100 text-blue-800",
    link: "/catering",
  },
  {
    title: "Private Chef",
    description: "Book a professional chef to cook at your home for special occasions",
    icon: ChefHat,
    color: "bg-green-100 text-green-800",
    link: "/chef-booking",
  },
  {
    title: "Venue Booking",
    description: "Find and book the perfect halls and spaces for your celebrations",
    icon: MapPin,
    color: "bg-purple-100 text-purple-800",
    link: "/venues",
  },
];

const ServiceCategories = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our network of verified professionals ready to make your next event memorable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link to={service.link} key={index}>
              <Card className="h-full card-hover">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
