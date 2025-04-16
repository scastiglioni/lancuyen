import { useState } from "react";
import { Payment } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";

interface UploadVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
}

export default function UploadVoucherDialog({ 
  open, 
  onOpenChange,
  payment 
}: UploadVoucherDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    month: payment.month,
    year: payment.year,
    amount: payment.amount,
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: "Transferencia Bancaria",
    file: null as File | null
  });
  
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/payments/upload', undefined, {
        method: 'POST',
        body: data,
        headers: {},
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Comprobante subido",
        description: "El comprobante de pago ha sido registrado exitosamente.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      
      // Close dialog
      onOpenChange(false);
      
      // Reset form
      setFormData({
        month: payment.month,
        year: payment.year,
        amount: payment.amount,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: "Transferencia Bancaria",
        file: null
      });
      setFilePreview(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo subir el comprobante. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
    
    // Create preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create form data for file upload
    const submitData = new FormData();
    submitData.append('month', formData.month);
    submitData.append('year', formData.year.toString());
    submitData.append('amount', formData.amount.toString());
    submitData.append('paymentDate', formData.paymentDate);
    submitData.append('paymentMethod', formData.paymentMethod);
    
    if (formData.file) {
      submitData.append('receiptFile', formData.file);
    }
    
    uploadMutation.mutate(submitData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg leading-6 font-medium text-neutral-500">
            Subir Comprobante de Pago
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            Por favor sube una imagen clara del comprobante de pago para el mes seleccionado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-month">Mes de Pago</Label>
                <Select
                  defaultValue={formData.month}
                  onValueChange={(value) => setFormData({ ...formData, month: value })}
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ].map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="payment-amount">Monto Pagado</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-date">Fecha de Pago</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select
                  defaultValue={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferencia Bancaria">Transferencia Bancaria</SelectItem>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-400">Comprobante de Pago</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                {filePreview ? (
                  <div className="text-center">
                    <img src={filePreview} alt="Vista previa" className="mx-auto h-32 object-contain mb-2" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, file: null });
                        setFilePreview(null);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-neutral-400" />
                    <div className="flex text-sm text-neutral-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Subir un archivo</span>
                        <Input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.gif,.pdf"
                        />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-neutral-400">
                      PNG, JPG, GIF, PDF hasta 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Enviando..." : "Registrar Pago"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
