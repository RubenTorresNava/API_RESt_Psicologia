import { connection } from "../db/conection.js";
import { format, parse } from "date-fns";

//obtener todas las citas y formatear la fecha dd/mm/yyyy
export const getCitas = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                Citas.id_cita,
                Pacientes.nombre AS nombre_paciente,
                Pacientes.apellido AS apellido_paciente,
                Psicologos.nombre AS nombre_psicologo,
                Psicologos.apellido AS apellido_psicologo,
                Citas.fecha_cita,
                Citas.hora_cita,
                Citas.tipo_cita,
                Citas.estado
            FROM 
                Citas
            JOIN 
                Pacientes ON Citas.id_paciente = Pacientes.id_paciente
            JOIN 
                Psicologos ON Citas.id_psicologo = Psicologos.id_psicologo
            WHERE 
                Citas.id_psicologo = ?
        `, [userId]);
        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date (cita.fecha_cita), "dd/MM/yyyy");
            //formato de 24 horas
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });
        res.status(200).        json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener una cita por id
export const getCitaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`
            SELECT
                Citas.id_cita,
                Pacientes.nombre AS nombre_paciente,
                Pacientes.apellido AS apellido_paciente,
                Psicologos.nombre AS nombre_psicologo,
                Psicologos.apellido AS apellido_psicologo,
                Citas.fecha_cita,
                Citas.hora_cita,
                Citas.tipo_cita,
                Citas.estado
            FROM 
                Citas
            JOIN 
                Pacientes ON Citas.id_paciente = Pacientes.id_paciente
            JOIN 
                Psicologos ON Citas.id_psicologo = Psicologos.id_psicologo
            WHERE 
                Citas.id_cita = ?
        `, [id]);
        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date (cita.fecha_cita), "dd/MM/yyyy");
            //formato de 24 horas
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//crear una cita
export const createCita = async (req, res) => {
    try {
        const { id_paciente, fecha_cita, hora_cita, tipo_cita } = req.body;
        const userId = req.userId;
    
        // Convertir la fecha del formato dd/mm/aaaa a aaaa-mm-dd
        const parsedFechaCita = parse(fecha_cita, 'dd/MM/yyyy', new Date());
        const formattedFechaCita = format(parsedFechaCita, 'yyyy-MM-dd');
    
        // Convertir la hora del formato hh:mm a hh:mm:ss
        const parsedHoraCita = parse(hora_cita, 'HH:mm', new Date());
        const formattedHoraCita = format(parsedHoraCita, 'HH:mm:ss');
    
        const [rows] = await connection.query(`
            INSERT INTO Citas (id_paciente, id_psicologo, fecha_cita, hora_cita, tipo_cita)
            VALUES (?, ?, ?, ?, ?)
        `, [id_paciente, userId, formattedFechaCita, formattedHoraCita, tipo_cita]);
    
        res.status(201).json({ message: "Cita creada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//actualizar una cita
export const updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_cita, hora_cita, tipo_cita, estado } = req.body;
    
        // Convertir la fecha del formato dd/mm/aaaa a aaaa-mm-dd
        const parsedFechaCita = parse(fecha_cita, 'dd/MM/yyyy', new Date());
        const formattedFechaCita = format(parsedFechaCita, 'yyyy-MM-dd');
    
        // Convertir la hora del formato hh:mm a hh:mm:ss
        const parsedHoraCita = parse(hora_cita, 'HH:mm', new Date());
        const formattedHoraCita = format(parsedHoraCita, 'HH:mm:ss');
    
        const [rows] = await connection.query(`
            UPDATE Citas
            SET fecha_cita = ?, hora_cita = ?, tipo_cita = ?, estado = ?
            WHERE id_cita = ?
        `, [formattedFechaCita, formattedHoraCita, tipo_cita, estado, id]);
    
        res.status(200).json({ message: "Cita actualizada correctamente", rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//eliminar una cita
export const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`
            DELETE FROM Citas
            WHERE id_cita = ?
        `, [id]);
    
        res.status(200).json({ message: "Cita eliminada correctamente", rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
