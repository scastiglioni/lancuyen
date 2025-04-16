import { useQuery } from "@tanstack/react-query";
import { Payment } from "@shared/schema";
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentHistory() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });
  
  // Sort payments by date (most recent first) and then by month
  const sortedPayments = [...(payments || [])].sort((a, b) => {
    // If both have payment dates, sort by date (most recent first)
    if (a.paymentDate && b.paymentDate) {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    }
    
    // If only one has a payment date, that one comes first
    if (a.paymentDate) return -1;
    if (b.paymentDate) return 1;
    
    // If neither has a payment date, sort by month
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
  
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
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Historial de Pagos</CardTitle>
          <CardDescription>Registro completo de pagos y comprobantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Mes</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Año</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Valor</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Estado</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Fecha de Pago</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Método</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Comprobante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-neutral-200">
                {sortedPayments.length > 0 ? (
                  sortedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-500">
                        {payment.month}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {payment.year}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {payment.paid ? (
                          <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">
                            Pagado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-500 border-amber-200">
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {payment.paymentDate 
                          ? format(new Date(payment.paymentDate), 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {payment.paymentMethod || '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {payment.receiptUrl ? (
                          <a 
                            href={payment.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:text-primary-dark flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            <span>Ver</span>
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-4 text-center text-sm text-neutral-400">
                      No hay pagos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button disabled variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Descargar historial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
