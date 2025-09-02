import pool from '../config/db.js';

// Función para obtener todos los proyectos sin usar created_at
const getAllProjects = async () => {
  try {
    // Primero veamos qué columnas existen
    const res = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    return res.rows;
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    throw error;
  }
};

// Puedes añadir más funciones aquí, como:
// const getProjectById = async (id) => { ... };
// const createProject = async (projectData) => { ... };

export default {
  getAllProjects,
};