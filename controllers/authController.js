import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
  register: async (req, res) => {
    const { nombre, apellido, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create(nombre, apellido, email, hashedPassword);
      res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Login exitoso", token, rol: user.rol });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ error: "No autorizado" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user;
      next();
    });
  },

  checkAdminRole: (req, res, next) => {
    if (req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo para administradores" });
    }
    next();
  },

  changePassword: async (req, res) => {
    console.log("ChangePassword route hit!", req.user);
    console.log("Token received:", req.headers.authorization);

    const { newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query =
        "UPDATE usuarios SET password = $1 WHERE id = $2 RETURNING id";
      const result = await pool.query(query, [hashedPassword, userId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  resetPassword: async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado con ese email" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query =
        "UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING id";
      await pool.query(query, [hashedPassword, email]);

      res.status(200).json({ message: "Contraseña reseteada con éxito" });
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getLoggedInUser: async (req, res) => {
    try {
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
      res.json({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
      });
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      res
        .status(500)
        .json({ error: "Error del servidor al obtener datos del usuario." });
    }
  },

  checkEmailExists: async (req, res) => {
    const { email } = req.query;
    try {
      const query = "SELECT COUNT(*) FROM usuarios WHERE email = $1";
      const result = await pool.query(query, [email]);
      const exists = result.rows[0].count > 0;
      res.json({ exists });
    } catch (error) {
      console.error("Error al verificar el email:", error);
      res
        .status(500)
        .json({ error: "Error del servidor al verificar el email." });
    }
  },
};

export default authController;
