
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChefHat, House, MapPin, PartyPopper, Utensils } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-festive-500" />
          <span className="font-bold text-xl text-festive-800">FestiveFeastFind</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center gap-1 text-foreground/80 hover:text-festive-500 transition-colors">
            <House className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/event-management" className="flex items-center gap-1 text-foreground/80 hover:text-festive-500 transition-colors">
            <PartyPopper className="h-4 w-4" />
            <span>Events</span>
          </Link>
          <Link to="/catering" className="flex items-center gap-1 text-foreground/80 hover:text-festive-500 transition-colors">
            <Utensils className="h-4 w-4" />
            <span>Catering</span>
          </Link>
          <Link to="/chef-booking" className="flex items-center gap-1 text-foreground/80 hover:text-festive-500 transition-colors">
            <ChefHat className="h-4 w-4" />
            <span>Book a Chef</span>
          </Link>
          <Link to="/venues" className="flex items-center gap-1 text-foreground/80 hover:text-festive-500 transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Venues</span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" size="sm">Log in</Button>
          <Button size="sm" className="bg-festive-500 hover:bg-festive-600">Register Business</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-festive-500"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open menu</span>
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-50 bg-background border-b border-border">
          <div className="space-y-1 px-4 py-3">
            <Link to="/" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted" onClick={toggleMenu}>
              <House className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/event-management" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted" onClick={toggleMenu}>
              <PartyPopper className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link to="/catering" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted" onClick={toggleMenu}>
              <Utensils className="h-5 w-5" />
              <span>Catering</span>
            </Link>
            <Link to="/chef-booking" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted" onClick={toggleMenu}>
              <ChefHat className="h-5 w-5" />
              <span>Book a Chef</span>
            </Link>
            <Link to="/venues" className="flex items-center gap-2 p-3 rounded-md hover:bg-muted" onClick={toggleMenu}>
              <MapPin className="h-5 w-5" />
              <span>Venues</span>
            </Link>
          </div>
          <div className="px-4 py-3 space-y-3 border-t border-border">
            <Button variant="outline" className="w-full">Log in</Button>
            <Button className="w-full bg-festive-500 hover:bg-festive-600">Register Business</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
