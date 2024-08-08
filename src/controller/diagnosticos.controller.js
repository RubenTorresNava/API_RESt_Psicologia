import { connection } from "../db/conection.js";
import { format, parse } from "date-fns";

//obtener todos los diagnosticos y formatear la fecha dd/mm/yyyy
export const getDiagnosticos = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                Diagnosticos.id_diagnostico,
                Pacientes.nombre AS nombre_paciente,
                Pacientes.apellido AS apellido_paciente,
                Psicologos.nombre AS nombre_psicologo,
                Psicologos.apellido AS apellido_psicologo,
                Diagnosticos.fecha_diagnostico,
                Diagnosticos.diagnostico
            FROM 
                Diagnosticos
            JOIN 
                Pacientes ON Diagnosticos.id_paciente = Pacientes.id_paciente
            JOIN 
                Psicologos ON Diagnosticos.id_psicologo = Psicologos.id_psicologo
            WHERE 
                Diagnosticos.id_psicologo = ?
        `, [userId]);
        rows.forEach((diagnostico) => {
            diagnostico.fecha_diagnostico = format(new Date (diagnostico.fecha_diagnostico), "dd/MM/yyyy");
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener un diagnostico por id
export const getDiagnostico = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const [rows] = await connection.query(`
            SELECT
                Diagnosticos.id_diagnostico,
                Pacientes.nombre AS nombre_paciente,
                Pacientes.apellido AS apellido_paciente,
                Psicologos.nombre AS nombre_psicologo,
                Psicologos.apellido AS apellido_psicologo,
                Diagnosticos.fecha_diagnostico,
                Diagnosticos.diagnostico
            FROM 
                Diagnosticos
            JOIN 
                Pacientes ON Diagnosticos.id_paciente = Pacientes.id_paciente
            JOIN 
                Psicologos ON Diagnosticos.id_psicologo = Psicologos.id_psicologo
            WHERE 
                Diagnosticos.id_diagnostico = ? AND Diagnosticos.id_psicologo = ?
        `, [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Diagnostico no encontrado" });
        }
        rows[0].fecha_diagnostico = format(new Date (rows[0].fecha_diagnostico), "dd/MM/yyyy");
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//crear un diagnostico
export const createDiagnostico = async (req, res) => {
    const userId = req.userId;
    const { id_paciente, fecha_diagnostico, diagnostico } = req.body;
    try {
        await connection.query(`
            INSERT INTO Diagnosticos (id_paciente, id_psicologo, fecha_diagnostico, diagnostico)
            VALUES (?, ?, ?, ?)
        `, [id_paciente, userId, parse(fecha_diagnostico, "dd/MM/yyyy", new Date()), diagnostico]);
        res.status(201).json({ message: "Diagnostico creado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//actualizar un diagnostico
export const updateDiagnostico = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { fecha_diagnostico, diagnostico } = req.body;
    try {
        const [rows] = await connection.query(`
            SELECT * FROM Diagnosticos WHERE id_diagnostico = ? AND id_psicologo = ?
        `, [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Diagnostico no encontrado" });
        }
        await connection.query(`
            UPDATE Diagnosticos SET fecha_diagnostico = ?, diagnostico = ? WHERE id_diagnostico = ?
        `, [parse(fecha_diagnostico, "dd/MM/yyyy", new Date()), diagnostico, id]);
        res.status(200).json({ message: "Diagnostico actualizado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//eliminar un diagnostico
export const deleteDiagnostico = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const [rows] = await connection.query(`
            SELECT * FROM Diagnosticos WHERE id_diagnostico = ? AND id_psicologo = ?
        `, [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Diagnostico no encontrado" });
        }
        await connection.query(`
            DELETE FROM Diagnosticos WHERE id_diagnostico = ?
        `, [id]);
        res.status(200).json({ message: "Diagnostico eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};