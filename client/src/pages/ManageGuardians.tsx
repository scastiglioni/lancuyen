import { useQuery } from "@tanstack/react-query";
import { Guardian } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "wouter";
import { UserPlus, Mail, Phone, User2 } from "lucide-react";

export default function ManageGuardians() {
  const { toast } = useToast();
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  
  const { data: guardians, isLoading } = useQuery<Omit<Guardian, "password">[]>({
    queryKey: ['/api/admin/guardians'],
  });
  
  const handleViewPayments = (guardian: Guardian) => {
    // In a real app, this would navigate to the guardian's payments
    // For now we'll just show a toast
    toast({
      title: `Pagos de ${guardian.name}`,
      description: "Esta funcionalidad estaría disponible en una implementación completa."
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Gestión de Apoderados</CardTitle>
            <CardDescription>Administra los apoderados y sus pagos</CardDescription>
          </div>
          <Button asChild>
            <Link href="/register">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Apoderado
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Nombre</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Teléfono</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Estudiante</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Curso</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-neutral-200">
                {guardians && guardians.length > 0 ? (
                  guardians.map((guardian) => (
                    <TableRow key={guardian.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                            <User2 className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">
                              {guardian.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Mail className="h-4 w-4 mr-1 text-neutral-400" />
                          {guardian.email}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Phone className="h-4 w-4 mr-1 text-neutral-400" />
                          {guardian.phone}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {guardian.studentName}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {guardian.studentGrade}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="link" 
                          onClick={() => handleViewPayments(guardian)}
                        >
                          Ver Pagos
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-400">
                      No hay apoderados registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
