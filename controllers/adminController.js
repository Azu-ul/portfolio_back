import pool from "../config/db.js";

// PORTFOLIO OPERATIONS
export const getAllProjects = async (req, res) => {
  try {
    console.log("Getting projects...");

    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("Projects table does not exist");
      return res.status(200).json([]);
    }

    const result = await pool.query(`
      SELECT id, title, description, url, image, category
      FROM projects 
      ORDER BY id DESC
    `);

    console.log("Projects retrieved:", result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    res.status(500).json({
      error: "Error al obtener los proyectos",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const createProject = async (req, res) => {
  const { title, description, url, image, category = "general" } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO projects (title, description, url, image, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, url, image, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      error: "Error al crear el proyecto",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, url, image, category } = req.body;

  try {
    const result = await pool.query(
      "UPDATE projects SET title=$1, description=$2, url=$3, image=$4, category=$5, updated_at=NOW() WHERE id=$6 RETURNING *",
      [title, description, url, image, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      error: "Error al actualizar el proyecto",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM projects WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      error: "Error al eliminar el proyecto",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// CONTENT OPERATIONS
export const getHeader = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM site_header WHERE id = 1 LIMIT 1"
    );

    if (result.rows.length === 0) {
      // Retornar datos por defecto si no existe
      return res.json({
        main_title: "Dra. Clara Keller",
        subtitle: "Neuróloga & Investigadora Especialista en Parkinson",
        cta_text: "Conocer más →",
        linkedin_url: "https://linkedin.com/in/clara-keller-neuro",
        website_url: "http://www.drakeller-neuro.com",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting header:", error);
    res.status(500).json({
      error: "Error al obtener header",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAbout = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM site_about WHERE id = 1 LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.json({
        title: "About Me",
        paragraph_1:
          "Soy Dra. Clara Keller, médica neuróloga con formación en bioquímica.",
        paragraph_2: "Desarrollo investigación en enfermedad de Parkinson.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting about:", error);
    res.status(500).json({
      error: "Error al obtener about",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getContact = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM site_contact WHERE id = 1 LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.json({
        title: "Contact Me",
        email: "clara.keller.neuro@example.com",
        website: "www.drakeller-neuro.com",
        location: "Viena, Austria",
        linkedin: "linkedin.com/in/clara-keller-neuro",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting contact:", error);
    res.status(500).json({
      error: "Error al obtener contact",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getFooter = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM site_footer WHERE id = 1 LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.json({
        name: "Dra. Clara Keller",
        description: "Neuróloga & Investigadora en Parkinson",
        location_text: "Based in Viena, Austria",
        specialty_text: "Especialista en Neurología y Enfermedad de Parkinson",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting footer:", error);
    res.status(500).json({
      error: "Error al obtener footer",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateHeader = async (req, res) => {
  const { main_title, subtitle, cta_text, linkedin_url, website_url } =
    req.body;

  try {
    const result = await pool.query(
      "UPDATE site_header SET main_title=$1, subtitle=$2, cta_text=$3, linkedin_url=$4, website_url=$5, updated_at=NOW() WHERE id=1 RETURNING *",
      [main_title, subtitle, cta_text, linkedin_url, website_url]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Header no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating header:", error);
    res.status(500).json({
      error: "Error al actualizar header",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateAbout = async (req, res) => {
  const { title, paragraph_1, paragraph_2 } = req.body;

  try {
    const result = await pool.query(
      "UPDATE site_about SET title=$1, paragraph_1=$2, paragraph_2=$3, updated_at=NOW() WHERE id=1 RETURNING *",
      [title, paragraph_1, paragraph_2]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "About no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating about:", error);
    res.status(500).json({
      error: "Error al actualizar about",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateContact = async (req, res) => {
  const { title, email, website, location, linkedin } = req.body;

  try {
    const result = await pool.query(
      "UPDATE site_contact SET title=$1, email=$2, website=$3, location=$4, linkedin=$5, updated_at=NOW() WHERE id=1 RETURNING *",
      [title, email, website, location, linkedin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contact no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      error: "Error al actualizar contact",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateFooter = async (req, res) => {
  const { name, description, location_text, specialty_text } = req.body;

  try {
    const result = await pool.query(
      "UPDATE site_footer SET name=$1, description=$2, location_text=$3, specialty_text=$4, updated_at=NOW() WHERE id=1 RETURNING *",
      [name, description, location_text, specialty_text]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Footer no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating footer:", error);
    res.status(500).json({
      error: "Error al actualizar footer",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getSkills = async (req, res) => {
  try {
    // Usar la tabla skills simple
    const result = await pool.query(
      'SELECT * FROM skills ORDER BY parent_category, level DESC'
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting skills:', error);
    res.status(500).json({
      error: 'Error al obtener las skills',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getSoftSkills = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, description FROM soft_skills ORDER BY id ASC"
    );

    res.status(200).json({
      title: "Habilidades Adicionales",
      softSkills: result.rows,
    });
  } catch (error) {
    console.error("Error getting soft skills:", error);
    res.status(500).json({
      error: "Error al obtener las habilidades adicionales",
      details: error.message,
    });
  }
};

export const createProjectTechnologies = async (req, res) => {
  const { id } = req.params;
  const { technologies } = req.body;

  try {
    // Primero eliminar tecnologías existentes del proyecto
    await pool.query("DELETE FROM project_technologies WHERE project_id = $1", [
      id,
    ]);

    // Insertar las nuevas tecnologías
    if (technologies && technologies.length > 0) {
      const values = technologies
        .filter((tech) => tech.trim() !== "")
        .map((tech) => `(${id}, '${tech.trim().replace(/'/g, "''")}')`); // Escapar comillas simples

      if (values.length > 0) {
        await pool.query(
          `INSERT INTO project_technologies (project_id, name) VALUES ${values.join(
            ", "
          )}`
        );
      }
    }

    res.status(201).json({ message: "Tecnologías actualizadas correctamente" });
  } catch (error) {
    console.error("Error creating project technologies:", error);
    res.status(500).json({
      error: "Error al guardar las tecnologías",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Funciones para skills
export const getAllSkills = async (req, res) => {
  try {
    const query = 'SELECT * FROM skills ORDER BY parent_category, level DESC';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error getting skills:', error);
    res.status(500).json({ error: 'Error al obtener las skills' });
  }
};

export const createSkill = async (req, res) => {
  const { type, parent_category, name, level, description } = req.body;

  try {
    const query = `
      INSERT INTO skills (type, parent_category, name, level, description) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [type, parent_category, name, level, description];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Error al crear la skill' });
  }
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { type, parent_category, name, level, description } = req.body;

  try {
    const query = `
      UPDATE skills 
      SET type = $1, parent_category = $2, name = $3, level = $4, description = $5 
      WHERE id = $6 
      RETURNING *
    `;
    const values = [type, parent_category, name, level, description, id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Skill no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Error al actualizar la skill' });
  }
};

export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM skills WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Skill no encontrada' });
    }

    res.json({ message: 'Skill eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Error al eliminar la skill' });
  }
};
