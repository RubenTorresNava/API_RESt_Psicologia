import { connection } from "../db/conection.js";
import { format, parse } from "date-fns";

//obtener todos los diagnosticos y formatear la fecha dd/mm/yyyy
export const getDiagnosticos = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                diagnosticos.id_diagnostico,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                diagnosticos.fecha_diagnostico,
                diagnosticos.diagnostico
            FROM 
                diagnosticos
            JOIN 
                pacientes ON diagnosticos.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON diagnosticos.id_psicologo = psicologos.id_psicologo
            WHERE 
                diagnosticos.id_psicologo = ?
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
                diagnosticos.id_diagnostico,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                diagnosticos.fecha_diagnostico,
                diagnosticos.diagnostico
            FROM 
                diagnosticos
            JOIN 
                pacientes ON diagnosticos.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON diagnosticos.id_psicologo = psicologos.id_psicologo
            WHERE 
                diagnosticos.id_diagnostico = ? AND diagnosticos.id_psicologo = ?
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
            INSERT INTO diagnosticos (id_paciente, id_psicologo, fecha_diagnostico, diagnostico)
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
            SELECT * FROM diagnosticos WHERE id_diagnostico = ? AND id_psicologo = ?
        `, [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Diagnostico no encontrado" });
        }
        await connection.query(`
            UPDATE diagnosticos SET fecha_diagnostico = ?, diagnostico = ? WHERE id_diagnostico = ?
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
            SELECT * FROM diagnosticos WHERE id_diagnostico = ? AND id_psicologo = ?
        `, [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Diagnostico no encontrado" });
        }
        await connection.query(`
            DELETE FROM diagnosticos WHERE id_diagnostico = ?
        `, [id]);
        res.status(200).json({ message: "Diagnostico eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};