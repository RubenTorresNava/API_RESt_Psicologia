import { connection } from "../db/conection.js";
import jwt from 'jsonwebtoken';

//ingresar un nuevo psicologo
export const createPsicologo = async (req, res) => {
    try {
        const { nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena } = req.body;
        const [rows] = await connection.query(
            "INSERT INTO psicologos (nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena) VALUES (?,?,?,?,?,?,?)",
            [nombre, apellido, especialidad, correo_electronico, telefono, usuario, contrasena]
        );
        res.status(200).json({message: "Psicologo agregado correctamente"});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
        

export const loginPsicologo = async (req, res) => {
    const { usuario, contrasena } = req.body;
    const comparePassword = (inputPassword, storedPassword) => {
        return inputPassword === storedPassword;
    };
    

    try {
        const [rows] = await connection.query(
            'SELECT * FROM psicologos WHERE usuario = ?',
            [usuario]
        );

        const psicologo = rows[0];

        if (!psicologo || !comparePassword(contrasena, psicologo.contrasena)) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: psicologo.id_psicologo, role: 'psicologo' },
            'secretkey',
            { expiresIn: '1h' }
        );

        res.json({message: `Bienvenido psicologo ${usuario}`, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


