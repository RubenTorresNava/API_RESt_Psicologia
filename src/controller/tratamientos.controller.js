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
                Tratamientos.nombre_tratamiento,
                Tratamientos.descripcion,
                Tratamientos.fecha_inicio,
                Tratamientos.fecha_fin,
                Psicologos.nombre AS nombre_psicologo,
                Psicologos.apellido AS apellido_psicologo
            FROM 
                Tratamientos
            JOIN 
                Pacientes ON Tratamientos.id_diagnostico = Pacientes.id_paciente
            JOIN 
                Psicologos ON Pacientes.id_psicologo = Psicologos.id_psicologo 
            WHERE
                Psicologos.id_psicologo = ${userId}
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