import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Dashboard de Pagos");
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUser();
  }, []);

  useEffect(() => {
    // Set page title based on current route
    switch (location) {
      case '/':
        setPageTitle('Dashboard de Pagos');
        break;
      case '/profile':
        setPageTitle('Perfil de Apoderado');
        break;
      case '/history':
        setPageTitle('Historial de Pagos');
        break;
      case '/monthly-fees':
        setPageTitle('Cuotas Mensuales');
        break;
      case '/manage-guardians':
        setPageTitle('Gestión de Apoderados');
        break;
      case '/settings':
        setPageTitle('Configuración');
        break;
      default:
        setPageTitle('Dashboard de Pagos');
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout', {});
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      setLocation('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-neutral-500">
          {pageTitle}
        </h2>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="font-medium">{getUserInitials()}</span>
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-400">
                {user.name}
              </span>
              <ChevronDown className="h-5 w-5 ml-1 text-neutral-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocation('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
