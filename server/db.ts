import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para permitir WebSockets para la conexión a la base de datos
neonConfig.webSocketConstructor = ws;

// Usar una URL de prueba si DATABASE_URL no está configurada
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

// Crear el pool de conexiones
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Crear la instancia de drizzle para interactuar con la base de datos
export const db = drizzle(pool, { schema });
