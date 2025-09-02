import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection con mejor manejo de errores
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Verificar que las tablas existen
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tablas disponibles:', tables.rows.map(row => row.table_name));
    client.release();
    
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos PostgreSQL:');
    console.error('Detalles:', err.message);
    console.error('¿Está ejecutándose PostgreSQL?');
    console.error('¿Son correctas las variables de entorno DB_*?');
  }
};

testConnection();

export default pool;