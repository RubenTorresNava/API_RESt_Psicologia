import { connection } from "../db/conection.js";
import { parse, format } from "date-fns";

// Obtener todos los tratamientos y formatear la fecha dd/mm/yyyy
export const getTratamientos = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                Tratamientos.id_tratamiento,
                Pacientes.nombre AS nombre_paciente,
                Pacientes.apellido AS apellido_paciente,
                Tratamientos.fecha_inicio,
                Tratamientos.fecha_fin,
                Tratamientos.nombre_tratamiento AS nombre_tratamiento,
                Tratamientos.descripcion
            FROM 
                Tratamientos
            JOIN 
                Pacientes ON Tratamientos.id_paciente = Pacientes.id_paciente
            JOIN 
                Psicologos ON Tratamientos.id_psicologo = Psicologos.id_psicologo
        `);
        rows.forEach((tratamiento) => {
            tratamiento.fecha_inicio = format(new Date(tratamiento.fecha_inicio), "dd/MM/yyyy");
            tratamiento.fecha_fin = format(new Date(tratamiento.fecha_fin), "dd/MM/yyyy");
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};