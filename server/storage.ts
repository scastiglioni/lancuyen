import { 
  guardians, Guardian, InsertGuardian, 
  payments, Payment, InsertPayment,
  activityLogs, ActivityLog, InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

export interface IStorage {
  // Guardian methods
  getGuardian(id: number): Promise<Guardian | undefined>;
  getGuardianByEmail(email: string): Promise<Guardian | undefined>;
  createGuardian(guardian: InsertGuardian): Promise<Guardian>;
  getAllGuardians(): Promise<Guardian[]>;
  
  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByGuardian(guardianId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined>;
  
  // Activity log methods
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogsByGuardian(guardianId: number): Promise<ActivityLog[]>;
  
  // Sesión
  sessionStore: session.Store;
}

// Configuración de la tienda de sesiones con PostgreSQL
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Inicializar la tienda de sesiones con PostgreSQL
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Verificar si ya existe el usuario demo y, si no, crearlo
    this.initializeDemoData();
  }

  // Método para inicializar datos de demostración si la base de datos está vacía
  private async initializeDemoData() {
    try {
      // Verificar si ya existe el usuario demo
      const existingUser = await this.getGuardianByEmail("juan@example.com");
      
      if (!existingUser) {
        console.log("Inicializando datos de demostración...");
        
        // Crear usuario demo
        const demoUser = await this.createGuardian({
          name: "Juan Díaz",
          email: "juan@example.com",
          phone: "+56 9 1234 5678",
          password: "password123",
          studentName: "Ana Díaz",
          studentGrade: "4° Básico"
        });
        
        // Crear pagos de demostración
        const demoMonths = [
          "Marzo", "Abril", "Mayo", "Junio", "Julio", 
          "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        
        for (let i = 0; i < demoMonths.length; i++) {
          const month = demoMonths[i];
          // Los primeros 5 meses están pagados
          const isPaid = i < 5;
          
          await this.createPayment({
            guardianId: demoUser.id,
            month: month,
            year: 2023,
            amount: 55000,
            paid: isPaid,
            paymentDate: isPaid ? new Date(2023, i + 2, 5) : undefined,
            receiptUrl: isPaid ? `/api/receipts/${month.toLowerCase()}_receipt.pdf` : undefined,
            paymentMethod: isPaid ? "Transferencia Bancaria" : undefined
          });
          
          // Crear registros de actividad para pagos realizados
          if (isPaid) {
            await this.createActivityLog({
              guardianId: demoUser.id,
              action: "Pago registrado",
              details: `Pago registrado para ${month}`,
              timestamp: new Date(2023, i + 2, 5)
            });
          }
        }
        
        console.log("Datos de demostración creados correctamente");
      }
    } catch (error) {
      console.error("Error al inicializar datos de demostración:", error);
    }
  }

  // Guardian methods
  async getGuardian(id: number): Promise<Guardian | undefined> {
    const result = await db.select().from(guardians).where(eq(guardians.id, id));
    return result[0];
  }

  async getGuardianByEmail(email: string): Promise<Guardian | undefined> {
    const result = await db.select().from(guardians).where(eq(guardians.email, email));
    return result[0];
  }

  async createGuardian(insertGuardian: InsertGuardian): Promise<Guardian> {
    const result = await db.insert(guardians).values(insertGuardian).returning();
    return result[0];
  }

  async getAllGuardians(): Promise<Guardian[]> {
    return db.select().from(guardians);
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getPaymentsByGuardian(guardianId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.guardianId, guardianId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async updatePayment(id: number, paymentUpdate: Partial<Payment>): Promise<Payment | undefined> {
    const result = await db
      .update(payments)
      .set(paymentUpdate)
      .where(eq(payments.id, id))
      .returning();
    
    return result[0];
  }

  // Activity log methods
  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const result = await db.insert(activityLogs).values(insertLog).returning();
    return result[0];
  }

  async getActivityLogsByGuardian(guardianId: number): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.guardianId, guardianId))
      .orderBy(desc(activityLogs.timestamp));
  }
}

// Exportar una instancia de la clase DatabaseStorage
export const storage = new DatabaseStorage();
