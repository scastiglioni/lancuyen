import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import GuardianProfile from "@/pages/GuardianProfile";
import PaymentHistory from "@/pages/PaymentHistory";
import MonthlyFees from "@/pages/MonthlyFees";
import ManageGuardians from "@/pages/ManageGuardians";
import Settings from "@/pages/Settings";
import RegisterGuardian from "@/pages/RegisterGuardian";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated and get role
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Authentication flow
  if (!isAuthenticated && location !== '/register') {
    return (
      <Switch>
        <Route path="/register" component={RegisterGuardian} />
        <Route component={Login} />
      </Switch>
    );
  }

  // Check if user is trying to access admin routes but is not an admin
  const isAdminRoute = location === '/manage-guardians' || location === '/settings';
  if (isAdminRoute && !isAdmin) {
    // Redirect non-admin users trying to access admin routes
    setLocation('/');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta sección.</p>
          <button 
            onClick={() => setLocation('/')} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/profile" component={GuardianProfile} />
        <Route path="/history" component={PaymentHistory} />
        <Route path="/monthly-fees" component={MonthlyFees} />
        {isAdmin && <Route path="/manage-guardians" component={ManageGuardians} />}
        {isAdmin && <Route path="/settings" component={Settings} />}
        <Route path="/register" component={RegisterGuardian} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
