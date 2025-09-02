import pool from '../config/db.js';

const User = {
  findByEmail: async (email) => {
    const query = 'SELECT u.*, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  create: async (nombre, apellido, email, password) => {
    // Inserta un nuevo usuario con el rol de 'usuario' (id = 2)
    const query = 'INSERT INTO usuarios (nombre, apellido, email, password, rol_id) VALUES ($1, $2, $3, $4, 2) RETURNING *';
    const result = await pool.query(query, [nombre, apellido, email, password]);
    return result.rows[0];
  },
};

export default User;