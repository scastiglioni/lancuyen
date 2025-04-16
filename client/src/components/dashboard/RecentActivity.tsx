import { useQuery } from "@tanstack/react-query";
import { ActivityLog } from "@shared/schema";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, CreditCard, Calendar } from "lucide-react";

export default function RecentActivity() {
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity'],
  });
  
  // Take only the last 3 logs
  const recentLogs = logs?.slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="mt-8 px-4 sm:px-0">
        <Card className="animate-pulse">
          <CardHeader className="px-4 py-5 sm:px-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="px-0 py-0 border-t border-neutral-200">
            <div className="h-32 bg-gray-100"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mt-8 px-4 sm:px-0">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6">
          <CardTitle className="text-lg leading-6 font-medium text-neutral-500">Actividad Reciente</CardTitle>
          <CardDescription className="mt-1 max-w-2xl text-sm text-neutral-400">Últimos movimientos de pagos</CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0 border-t border-neutral-200">
          <ul role="list" className="divide-y divide-neutral-200">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <li key={log.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 bg-opacity-10 rounded-md p-2">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm font-medium text-neutral-500">
                          {log.action} - {log.details?.split(' - ')[0]}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completado
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-neutral-400">
                          <CreditCard className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                          Transferencia Bancaria
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-neutral-400 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                        <p>
                          {format(new Date(log.timestamp), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 text-center text-sm text-neutral-400">
                No hay actividad reciente
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
