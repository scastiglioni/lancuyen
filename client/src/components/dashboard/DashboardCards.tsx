import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Payment } from "@shared/schema";
import { ClipboardCheck, Clock, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardCards() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });
  
  const [paymentStats, setPaymentStats] = useState({
    totalPaid: 0,
    totalPayments: 0,
    nextPayment: null as (Payment | null),
    lastPayment: null as (Payment | null)
  });
  
  useEffect(() => {
    if (payments) {
      // Calculate payment stats
      const paid = payments.filter(p => p.paid).length;
      const total = payments.length;
      
      // Find next payment (first unpaid)
      const nextPayment = payments
        .filter(p => !p.paid)
        .sort((a, b) => {
          // Sort by month (using a month index mapping for proper ordering)
          const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ];
          const monthIndexA = months.indexOf(a.month);
          const monthIndexB = months.indexOf(b.month);
          return monthIndexA - monthIndexB;
        })[0] || null;
      
      // Find last payment (most recent paid payment)
      const lastPayment = payments
        .filter(p => p.paid && p.paymentDate)
        .sort((a, b) => {
          // Sort by payment date (most recent first)
          const dateA = new Date(a.paymentDate || 0).getTime();
          const dateB = new Date(b.paymentDate || 0).getTime();
          return dateB - dateA;
        })[0] || null;
      
      setPaymentStats({
        totalPaid: paid,
        totalPayments: total,
        nextPayment,
        lastPayment
      });
    }
  }, [payments]);
  
  if (isLoading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
              <CardFooter className="bg-neutral-100 px-5 py-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-0">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Payments Status Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-md p-3">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-400 truncate">
                    Estado de Pagos
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-500">
                      {paymentStats.totalPaid}/{paymentStats.totalPayments} Pagados
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-100 px-5 py-3">
            <div className="text-sm">
              <Link href="/history">
                <a className="font-medium text-primary hover:text-primary-dark">
                  Ver todos los pagos
                </a>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Next Payment Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-500 bg-opacity-10 rounded-md p-3">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-400 truncate">
                    Próximo Pago
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-500">
                      {paymentStats.nextPayment 
                        ? `${paymentStats.nextPayment.month} - $${paymentStats.nextPayment.amount.toLocaleString()}`
                        : "Todos los pagos realizados"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-100 px-5 py-3">
            <div className="text-sm">
              {paymentStats.nextPayment && (
                <Link href="/monthly-fees">
                  <a className="font-medium text-primary hover:text-primary-dark">
                    Realizar pago
                  </a>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Last Payment Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 bg-opacity-10 rounded-md p-3">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-400 truncate">
                    Último Pago Realizado
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-500">
                      {paymentStats.lastPayment
                        ? `${paymentStats.lastPayment.month} - $${paymentStats.lastPayment.amount.toLocaleString()}`
                        : "Sin pagos"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-100 px-5 py-3">
            <div className="text-sm">
              {paymentStats.lastPayment && paymentStats.lastPayment.receiptUrl && (
                <a 
                  href={paymentStats.lastPayment.receiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Ver comprobante
                </a>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
