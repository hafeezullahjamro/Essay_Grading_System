import { useState } from "react";
import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface GoogleSignInProps {
  mode?: "login" | "signup";
}

export function GoogleSignIn({ mode = "login" }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // If user is already logged in, don't show the button
  if (user) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // For mobile, use redirect. For desktop, use popup.
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
        // The result will be handled when the page reloads
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await handleAuthResult(result);
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      let errorMessage = "Failed to sign in with Google";
      
      if (error.code === "auth/configuration-not-found") {
        errorMessage = "Firebase configuration error. The current domain needs to be authorized in Firebase Console.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups for this site or try again.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in cancelled. Please try again.";
      }
      
      toast({
        title: "Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthResult = async (result: any) => {
    // Get the user info from the result
    const user = result.user;
    const { displayName, email, uid, photoURL } = user;
    
    try {
      // Call our backend to create or login the user
      const response = await apiRequest("POST", "/api/auth/google", {
        displayName,
        email,
        uid,
        photoURL
      });
      
      if (!response.ok) {
        throw new Error("Failed to authenticate with the server");
      }
      
      const userData = await response.json();
      
      // Update the user data in react-query
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Signed in",
        description: `Welcome ${userData.username || displayName}!`,
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Server auth error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to complete authentication with the server",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"></path>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"></path>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"></path>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"></path>
          </g>
        </svg>
      )}
      <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
    </Button>
  );
}