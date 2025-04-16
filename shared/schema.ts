import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guardians (Apoderados)
export const guardians = pgTable("guardians", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  studentName: text("student_name").notNull(),
  studentGrade: text("student_grade").notNull(),
  role: text("role").notNull().default("guardian"), // 'guardian' o 'admin'
});

export const insertGuardianSchema = createInsertSchema(guardians).pick({
  name: true,
  email: true,
  phone: true,
  password: true,
  studentName: true,
  studentGrade: true,
  role: true,
});

// Monthly Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  guardianId: integer("guardian_id").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  amount: integer("amount").notNull(),
  paid: boolean("paid").default(false),
  paymentDate: timestamp("payment_date"),
  receiptUrl: text("receipt_url"),
  paymentMethod: text("payment_method"),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  guardianId: true,
  month: true,
  year: true,
  amount: true,
  paid: true,
  paymentDate: true,
  receiptUrl: true,
  paymentMethod: true,
});

// Activity Log
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  guardianId: integer("guardian_id").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  guardianId: true,
  action: true,
  details: true,
  timestamp: true,
});

// Types
export type Guardian = typeof guardians.$inferSelect;
export type InsertGuardian = z.infer<typeof insertGuardianSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

// Extended Schemas with validation
export const registerGuardianSchema = insertGuardianSchema.extend({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Por favor ingrese su contraseña" }),
});

export const uploadReceiptSchema = z.object({
  month: z.string(),
  year: z.number(),
  amount: z.number(),
  paymentDate: z.string(),
  paymentMethod: z.string(),
  receiptFile: z.any().optional(),
});
