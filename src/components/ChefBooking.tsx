
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

const ChefBooking = () => {
  return (
    <section className="py-20 bg-festive-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Chef cooking at home" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-white/90 backdrop-blur rounded-xl shadow-lg max-w-xs hidden md:block">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-3 bg-festive-100">
                    <ChefHat className="h-6 w-6 text-festive-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Menus</h4>
                    <p className="text-sm text-muted-foreground">Our chefs customize menus to your tastes and dietary needs</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 p-4 bg-feast-100 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-feast-800">4.9</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-feast-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-feast-800">Top rated chefs</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="flex flex-col gap-6">
              <span className="inline-block px-4 py-1.5 bg-feast-100 text-feast-800 font-medium rounded-full text-sm w-fit">
                Special Dining Experience
              </span>
              <h2 className="heading-2">Book a Private Chef for Your Next Special Occasion</h2>
              <p className="text-lg text-muted-foreground">
                Enjoy restaurant-quality dining in the comfort of your home. Our professional chefs will create a memorable culinary experience for you and your guests.
              </p>
              <ul className="space-y-3">
                {[
                  "Professional chefs with verified credentials",
                  "Customized menus based on your preferences",
                  "Complete service including shopping and cleanup",
                  "Perfect for anniversaries, birthdays, and intimate gatherings"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-full p-1 bg-festive-100 mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-festive-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button className="bg-festive-500 hover:bg-festive-600">Book a Chef</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefBooking;
