import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Settings() {
  const { toast } = useToast();
  
  const [paymentSettings, setPaymentSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    monthlyAmount: 55000,
    accountNumber: "12345678",
    accountOwner: "Fundación Educativa",
    bank: "Banco Estado"
  });
  
  const handleSavePaymentSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de pagos ha sido actualizada exitosamente.",
    });
  };
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30
  });
  
  const handleSaveSecuritySettings = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de seguridad ha sido actualizada exitosamente.",
    });
  };
  
  return (
    <div className="px-4 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configuración</CardTitle>
          <CardDescription>Administra las preferencias del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payments">
            <TabsList className="mb-6">
              <TabsTrigger value="payments">Pagos</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payments">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-500">Notificaciones</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificaciones por email</Label>
                      <p className="text-sm text-neutral-400">Recibe notificaciones de pagos por email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={paymentSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({ ...paymentSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">Notificaciones por SMS</Label>
                      <p className="text-sm text-neutral-400">Recibe notificaciones de pagos por SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={paymentSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({ ...paymentSettings, smsNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-reminders">Recordatorios de pago</Label>
                      <p className="text-sm text-neutral-400">Recibe recordatorios de pagos pendientes</p>
                    </div>
                    <Switch
                      id="payment-reminders"
                      checked={paymentSettings.paymentReminders}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({ ...paymentSettings, paymentReminders: checked })
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-500">Configuración de pagos</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-amount">Monto mensual (CLP)</Label>
                      <Input
                        id="monthly-amount"
                        type="number"
                        value={paymentSettings.monthlyAmount}
                        onChange={(e) => 
                          setPaymentSettings({ ...paymentSettings, monthlyAmount: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bank">Banco</Label>
                    <Input
                      id="bank"
                      value={paymentSettings.bank}
                      onChange={(e) => 
                        setPaymentSettings({ ...paymentSettings, bank: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Número de cuenta</Label>
                      <Input
                        id="account-number"
                        value={paymentSettings.accountNumber}
                        onChange={(e) => 
                          setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="account-owner">Titular de la cuenta</Label>
                      <Input
                        id="account-owner"
                        value={paymentSettings.accountOwner}
                        onChange={(e) => 
                          setPaymentSettings({ ...paymentSettings, accountOwner: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePaymentSettings}>Guardar cambios</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-500">Seguridad de la cuenta</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor-auth">Autenticación de dos factores</Label>
                      <p className="text-sm text-neutral-400">Aumenta la seguridad de tu cuenta</p>
                    </div>
                    <Switch
                      id="two-factor-auth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Tiempo de inactividad (minutos)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => 
                        setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })
                      }
                    />
                    <p className="text-sm text-neutral-400">Tiempo de inactividad antes de cerrar sesión automáticamente</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-500">Cambiar contraseña</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSecuritySettings}>Guardar cambios</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="system">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-500">Configuración del sistema</h3>
                  
                  <div className="p-4 bg-neutral-100 rounded-md">
                    <p className="text-sm text-neutral-500">
                      Esta sección está reservada para administradores del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
