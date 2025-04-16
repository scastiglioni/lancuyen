import MonthlyPaymentsTable from "@/components/dashboard/MonthlyPaymentsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MonthlyFees() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="px-4 sm:px-0">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Cuotas Mensuales</CardTitle>
          <CardDescription>Gestión de pagos mensuales del año escolar {currentYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Información de pago</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Las cuotas deben ser pagadas dentro de los primeros 5 días de cada mes.</p>
              <p className="mb-2">Métodos de pago aceptados:</p>
              <ul className="list-disc ml-6">
                <li>Transferencia bancaria al Banco Estado</li>
                <li>Cuenta: 12345678</li>
                <li>RUT: 12.345.678-9</li>
                <li>Correo: pagos@colegio.cl</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 flex items-center text-sm text-neutral-500">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <p>El año escolar comprende desde Marzo hasta Diciembre, con un total de 10 cuotas mensuales.</p>
          </div>
        </CardContent>
      </Card>
      
      <MonthlyPaymentsTable />
    </div>
  );
}
