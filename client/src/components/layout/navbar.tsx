import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LucideShieldAlert } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Public navigation links
  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
  ];

  // Authenticated navigation links
  const authNavLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/grade", label: "Grade Essay" },
    { href: "/profile", label: "Profile" },
  ];

  // Get current active nav links based on authentication status
  const navLinks = user ? authNavLinks : publicNavLinks;

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center"
              >
                <Logo size={32} />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === link.href || (link.href === "/" && location === "")
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Authentication buttons or user menu */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                {/* Credit badge */}
                <div className="mr-4 hidden sm:flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <i className="fas fa-coins mr-1 text-amber-500"></i>
                    <span>{user.credits}</span> Credits
                  </span>
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-1 h-auto">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <i className="fas fa-user-circle text-lg"></i>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <span className="w-full cursor-pointer" onClick={() => window.location.href = "/profile"}>
                        Your Profile
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-full cursor-pointer" onClick={() => window.location.href = "/dashboard"}>
                        Dashboard
                      </span>
                    </DropdownMenuItem>
                    {user?.username === 'Hassan' && (
                      <DropdownMenuItem>
                        <span className="w-full cursor-pointer flex items-center text-amber-600" 
                          onClick={() => window.location.href = "/admin"}>
                          <LucideShieldAlert size={16} className="mr-2" />
                          Admin Panel
                        </span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center">
                <Link 
                  href="/auth" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link 
                  href="/auth" 
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                location === link.href
                  ? "bg-blue-50 border-primary text-primary"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <div className="pl-3 pr-4 py-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <i className="fas fa-coins mr-1 text-amber-500"></i>
                <span>{user.credits}</span> Credits
              </span>
            </div>
          )}
          
          {!user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center pl-3">
                <Link 
                  href="/auth" 
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in / Sign up
                </Link>
              </div>
            </div>
          )}
          
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <i className="fas fa-user-circle text-xl"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                {user?.username === 'Hassan' && (
                  <Link 
                    href="/admin" 
                    className="block px-4 py-2 text-base font-medium text-amber-600 hover:text-amber-700 hover:bg-gray-100 flex items-center" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LucideShieldAlert size={16} className="mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
