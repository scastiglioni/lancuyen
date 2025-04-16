import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGuardianSchema, 
  loginSchema, 
  uploadReceiptSchema,
  registerGuardianSchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage2,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF) y PDF'));
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const MemoryStoreSession = MemoryStore(session);
  
  // Configure session with PostgreSQL session store
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: storage.sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: 'sistema-pagos-escolar-secreto'
  }));
  
  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({ message: "No autorizado" });
  };
  
  // Admin middleware
  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: "Acceso prohibido: requiere permisos de administrador" });
  };

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const validatedData = registerGuardianSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getGuardianByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "El correo electrónico ya está registrado" });
      }
      
      // Create user without the confirmPassword field
      const { confirmPassword, ...userData } = validatedData;
      const newUser = await storage.createGuardian(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      // Log activity
      await storage.createActivityLog({
        guardianId: newUser.id,
        action: "Registro",
        details: "Nuevo apoderado registrado",
        timestamp: new Date()
      });
      
      // Create empty payment records for the current year
      const currentYear = new Date().getFullYear();
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      // Create payment records starting from March
      for (let i = 2; i < months.length; i++) {
        await storage.createPayment({
          guardianId: newUser.id,
          month: months[i],
          year: currentYear,
          amount: 55000, // Standard fee amount
          paid: false,
          paymentDate: undefined,
          receiptUrl: undefined,
          paymentMethod: undefined
        });
      }
      
      return res.status(201).json({ 
        message: "Apoderado registrado exitosamente",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Error de validación", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ message: "Error al registrar usuario" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getGuardianByEmail(validatedData.email);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      // Store user in session with role
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json({ 
        message: "Inicio de sesión exitoso",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Error de validación", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    });
  });

  // Guardian routes
  app.get('/api/me', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user?.id;
      const user = await storage.getGuardian(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener información del usuario" });
    }
  });

  // Payments routes
  app.get('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user?.id;
      const payments = await storage.getPaymentsByGuardian(userId);
      
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener pagos" });
    }
  });

  app.post('/api/payments/upload', isAuthenticated, upload.single('receiptFile'), async (req, res) => {
    try {
      const userId = req.session.user?.id;
      const data = uploadReceiptSchema.parse({
        ...req.body,
        amount: parseInt(req.body.amount),
        year: parseInt(req.body.year)
      });
      
      // Find the payment
      const payments = await storage.getPaymentsByGuardian(userId);
      const payment = payments.find(p => p.month === data.month && p.year === data.year);
      
      if (!payment) {
        return res.status(404).json({ message: "Pago no encontrado" });
      }
      
      let receiptUrl = undefined;
      
      // Check if a file was uploaded
      if (req.file) {
        receiptUrl = `/api/uploads/${req.file.filename}`;
      }
      
      // Update payment
      const updatedPayment = await storage.updatePayment(payment.id, {
        paid: true,
        paymentDate: new Date(data.paymentDate),
        receiptUrl: receiptUrl,
        paymentMethod: data.paymentMethod
      });
      
      // Create activity log
      await storage.createActivityLog({
        guardianId: userId,
        action: "Pago registrado",
        details: `Pago registrado para ${data.month} ${data.year}`,
        timestamp: new Date()
      });
      
      return res.status(200).json({
        message: "Comprobante subido exitosamente",
        payment: updatedPayment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Error de validación", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ message: "Error al subir comprobante" });
    }
  });

  // Handle uploaded files
  app.get('/api/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    
    return res.sendFile(filepath);
  });

  // Activity logs routes
  app.get('/api/activity', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user?.id;
      const logs = await storage.getActivityLogsByGuardian(userId);
      
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener actividad" });
    }
  });

  // Admin routes
  app.get('/api/admin/guardians', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const guardians = await storage.getAllGuardians();
      
      // Remove passwords from response
      const guardiansWithoutPasswords = guardians.map(guardian => {
        const { password, ...guardianWithoutPassword } = guardian;
        return guardianWithoutPassword;
      });
      
      return res.status(200).json(guardiansWithoutPasswords);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener apoderados" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
