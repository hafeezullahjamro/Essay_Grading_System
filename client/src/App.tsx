import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import GradePage from "@/pages/grade-page";
import ProfilePage from "@/pages/profile-page";
import AdminPage from "@/pages/admin-page";
import ExportPage from "@/pages/export-page";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/grade" component={GradePage} />
          <ProtectedRoute path="/export" component={ExportPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
