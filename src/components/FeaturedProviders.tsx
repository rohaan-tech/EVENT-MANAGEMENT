
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const providers = [
  {
    id: 1,
    name: "Elegant Affairs",
    category: "Event Management",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Royal Decor",
    category: "Decoration Services",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: 3,
    name: "Gourmet Delights",
    category: "Catering",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: 4,
    name: "Chef Antonio",
    category: "Private Chef",
    rating: 5.0,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
];

const FeaturedProviders = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="heading-2 mb-4">Featured Service Providers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover top-rated professionals trusted by our community
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">View All Providers</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="overflow-hidden card-hover">
              <div className="relative h-48">
                <img 
                  src={provider.image} 
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                {provider.featured && (
                  <Badge className="absolute top-3 right-3 bg-festive-500">Featured</Badge>
                )}
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-muted">{provider.category}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({provider.reviews})</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-3">{provider.name}</h3>
                <Button variant="secondary" size="sm" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;
