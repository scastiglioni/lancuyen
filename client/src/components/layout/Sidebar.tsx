import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  FileText,
  Calendar,
  Users,
  Settings,
  DollarSign
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export default function Sidebar() {
  const [location] = useLocation();
  
  // Obtener información del usuario actual
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const isAdmin = user?.role === 'admin';
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home
    },
    {
      name: "Perfil de Apoderado",
      path: "/profile",
      icon: User
    },
    {
      name: "Historial de Pagos",
      path: "/history",
      icon: FileText
    },
    {
      name: "Cuotas Mensuales",
      path: "/monthly-fees",
      icon: Calendar
    }
  ];
  
  const adminItems = [
    {
      name: "Gestión de Apoderados",
      path: "/manage-guardians",
      icon: Users
    },
    {
      name: "Configuración",
      path: "/settings",
      icon: Settings
    }
  ];
  
  return (
    <div className="bg-white shadow-md md:w-64 md:fixed md:h-full md:overflow-y-auto z-10">
      <div className="p-4 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-neutral-500 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-primary" />
          Sistema de Pagos
        </h1>
      </div>
      
      <nav className="p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>
              <Link href={item.path}>
                <div className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                  location === item.path 
                    ? "bg-primary bg-opacity-10 text-primary" 
                    : "text-neutral-400 hover:bg-neutral-100"
                )}>
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </div>
              </Link>
            </div>
          ))}
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="px-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  Administración
                </div>
              </div>
              
              {adminItems.map((item) => (
                <div key={item.path}>
                  <Link href={item.path}>
                    <div className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                      location === item.path 
                        ? "bg-primary bg-opacity-10 text-primary" 
                        : "text-neutral-400 hover:bg-neutral-100"
                    )}>
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </div>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
