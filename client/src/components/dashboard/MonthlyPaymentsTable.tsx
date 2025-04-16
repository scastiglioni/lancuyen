import { useQuery } from "@tanstack/react-query";
import { Payment } from "@shared/schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import UploadVoucherDialog from "@/components/dialogs/UploadVoucherDialog";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MonthlyPaymentsTable() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  const handleOpenUploadDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowUploadDialog(true);
  };
  
  if (isLoading) {
    return (
      <div className="mt-8 px-4 sm:px-0">
        <Card className="animate-pulse">
          <CardHeader className="px-4 py-5 sm:px-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="h-64 bg-gray-100"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Sort payments by month order
  const sortedPayments = [...(payments || [])].sort((a, b) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
  
  return (
    <div className="mt-8 px-4 sm:px-0">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-lg leading-6 font-medium text-neutral-500">Cuotas Mensuales</CardTitle>
            <CardDescription className="mt-1 max-w-2xl text-sm text-neutral-400">Año escolar {new Date().getFullYear()}</CardDescription>
          </div>
          <Button onClick={() => {
            // Find the first unpaid payment to pre-select
            const unpaidPayment = sortedPayments.find(p => !p.paid);
            if (unpaidPayment) {
              handleOpenUploadDialog(unpaidPayment);
            } else {
              // If all paid, select the most recent one
              const lastPayment = sortedPayments[sortedPayments.length - 1];
              handleOpenUploadDialog(lastPayment);
            }
          }}>
            <UploadCloud className="-ml-1 mr-2 h-5 w-5" />
            Subir Comprobante
          </Button>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Mes</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Valor</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Estado</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Fecha de Pago</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Comprobante</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-neutral-200">
              {sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-500">
                    {payment.month}
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
                    {payment.receiptUrl ? (
                      <a 
                        href={payment.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary-dark"
                      >
                        Ver comprobante
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenUploadDialog(payment)}
                      disabled={payment.paid}
                      className={payment.paid ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {payment.paid ? 'Pagado' : 'Subir comprobante'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {selectedPayment && (
        <UploadVoucherDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          payment={selectedPayment}
        />
      )}
    </div>
  );
}
