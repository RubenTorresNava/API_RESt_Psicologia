import { connection } from "../db/conection.js";
import jwt from 'jsonwebtoken';

//ingresar un nuevo psicologo
export const createPsicologo = async (req, res) => {
    try {
        const { nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena } = req.body;
        const [rows] = await connection.query(
            "INSERT INTO Psicologos (nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena) VALUES (?,?,?,?,?,?,?)",
            [nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena]
        );
        res.status(200).json({message: "Psicologo agregado correctamente"});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
        

export const loginPsicologo = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Obtener el psicólogo por nombre de usuario
        const [rows] = await connection.query(
            "SELECT * FROM Psicologos WHERE usuario = ?",
            [usuario]
        );

        if (rows.length > 0) {
            const psicologo = rows[0];

            // Comparar la contraseña proporcionada con la almacenada
            if (contrasena === psicologo.contrasena) {
                // Generar el token JWT
                const token = jwt.sign({ id_psicologo: psicologo.id_psicologo }, 'secretkey', {
                    expiresIn: '1d' // Caduca en 1 día
                });

                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: "Usuario o contraseña incorrectos" });
            }
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


