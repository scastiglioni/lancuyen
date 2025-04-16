import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración para permitir WebSockets para la conexión a la base de datos
neonConfig.webSocketConstructor = ws;

// Verificar que la URL de la base de datos esté definida
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL debe estar configurada. ¿Olvidaste aprovisionar una base de datos?",
  );
}

// Crear el pool de conexiones
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Crear la instancia de drizzle para interactuar con la base de datos
export const db = drizzle(pool, { schema });