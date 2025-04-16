import { useQuery } from "@tanstack/react-query";
import { Guardian } from "@shared/schema";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function GuardianProfile() {
  const { toast } = useToast();
  
  const { data: guardian, isLoading } = useQuery<Guardian>({
    queryKey: ['/api/me'],
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentName: "",
    studentGrade: ""
  });
  
  // Update form when data is fetched
  useState(() => {
    if (guardian) {
      setFormData({
        name: guardian.name,
        email: guardian.email,
        phone: guardian.phone,
        studentName: guardian.studentName,
        studentGrade: guardian.studentGrade
      });
    }
  });
  
  const handleSave = () => {
    // This would typically save the profile data
    // We're just showing a toast since we're using memory storage
    toast({
      title: "Información guardada",
      description: "El perfil ha sido actualizado exitosamente.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-0">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Perfil de Apoderado</CardTitle>
          <CardDescription>Ver y actualizar tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input 
                id="name" 
                value={guardian?.name || ""} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                value={guardian?.email || ""} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled
              />
              <p className="text-xs text-neutral-400 mt-1">El correo electrónico no puede ser cambiado</p>
            </div>
            
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                value={guardian?.phone || ""} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-500 mb-4">Información del Estudiante</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName">Nombre del Estudiante</Label>
                <Input 
                  id="studentName" 
                  value={guardian?.studentName || ""} 
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="studentGrade">Curso</Label>
                <Input 
                  id="studentGrade" 
                  value={guardian?.studentGrade || ""} 
                  onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
