
import { Button } from "@/components/ui/button";
import { ChefHat, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(255,122,16,0.06),transparent)]"></div>
      <div className="absolute right-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-festive-100 blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 -z-10 h-64 w-64 rounded-full bg-feast-100 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="flex flex-col gap-6">
            <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground font-medium rounded-full text-sm">
              Connecting Special Occasions with Exceptional Services
            </span>
            <h1 className="heading-1">
              <span className="text-festive-500">Celebrate</span> Life's Moments with the <span className="text-feast-500">Perfect</span> Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Find and book verified event planners, decorators, caterers, and private chefs for your next celebration - all in one place.
            </p>
            
            {/* Search box */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search for services, venues..."
                  className="rounded-lg border border-input bg-background px-10 py-3 w-full focus:outline-none focus:ring-2 focus:ring-festive-500 focus:border-transparent"
                />
              </div>
              <Button className="bg-festive-500 hover:bg-festive-600 py-3 px-6">Find Services</Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-festive-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Professionals
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-festive-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Booking
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-festive-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Top-rated Services
              </span>
            </div>
          </div>
          
          {/* Image collage */}
          <div className="relative hidden lg:block">
            <div className="absolute top-0 -left-4 w-72 h-56 rounded-xl overflow-hidden animate-float">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Elegant dinner setting" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-32 left-48 w-72 h-60 rounded-xl overflow-hidden animate-float" style={{animationDelay: "0.5s"}}>
              <img 
                src="https://images.unsplash.com/photo-1635363638580-c2809d049eee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Chef preparing food" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4 text-festive-500" />
                    <span>Private Chef Experience</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-16 w-80 h-48 rounded-xl overflow-hidden animate-float" style={{animationDelay: "1s"}}>
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Decorated wedding venue" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
