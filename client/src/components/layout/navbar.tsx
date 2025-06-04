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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center"
              >
                <Logo size={28} className="sm:size-32" />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                {/* Credit badge - hidden on mobile */}
                <div className="hidden lg:flex items-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                    <i className="fas fa-coins mr-1 text-amber-500"></i>
                    <span className="hidden sm:inline">{user.credits}</span>
                    <span className="sm:hidden">{user.credits}</span>
                    <span className="hidden sm:inline ml-1">Credits</span>
                  </span>
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-1 h-auto">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        <i className="fas fa-user-circle text-sm sm:text-lg"></i>
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
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link 
                  href="/auth" 
                  className="text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/auth" 
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200 shadow-lg`}>
        <div className="px-3 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "block px-3 py-3 rounded-md text-base font-medium transition-colors",
                location === link.href
                  ? "bg-blue-50 text-primary border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {!user && (
            <div className="pt-4 space-y-2">
              <Link 
                href="/auth" 
                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/auth" 
                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-white bg-primary hover:bg-blue-700 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
          
          {user && (
            <>
              {/* Credits display for mobile */}
              <div className="px-3 py-2 bg-blue-50 rounded-md">
                <span className="inline-flex items-center text-sm font-medium text-blue-800">
                  <i className="fas fa-coins mr-2 text-amber-500"></i>
                  {user.credits} Credits
                </span>
              </div>
              
              {/* User profile section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <i className="fas fa-user-circle text-xl"></i>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-base font-medium text-gray-800">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-1">
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-user mr-3 text-gray-400"></i>
                    Your Profile
                  </Link>
                  {user?.username === 'Hassan' && (
                    <Link 
                      href="/admin" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LucideShieldAlert size={16} className="mr-3 inline" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-sign-out-alt mr-3 text-red-400"></i>
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
