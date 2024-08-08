import { ro } from "date-fns/locale";
import { connection } from "../db/conection.js";
import { format, parse } from "date-fns";

//obtener todos los pacientes
export const getPacientes =async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                id_paciente,
                nombre,
                apellido,
                fecha_nacimiento,
                telefono,
                correo_electronico,
                direccion
            FROM 
                Pacientes
            WHERE 
                id_psicologo = ?
        `, [userId]);
        rows.forEach((paciente) => {
            paciente.fecha_nacimiento = format(new Date (paciente.fecha_nacimiento), "dd/MM/yyyy");
        });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener un paciente por id
export const getPacienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`
            SELECT
                id_paciente,
                nombre,
                apellido,
                fecha_nacimiento,
                telefono,
                correo_electronico,
                direccion
            FROM 
                Pacientes
            WHERE 
                id_paciente = ?
        `, [id]);
        rows.forEach((paciente) => {
            paciente.fecha_nacimiento = format(new Date (paciente.fecha_nacimiento), "dd/MM/yyyy");
        });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//crear un paciente con fecha de nacimiento en formato yyyy-mm-dd
export const createPaciente = async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, telefono, correo_electronico, direccion } = req.body;
    const userId = req.userId;
    const parcedDate = parse(fecha_nacimiento, "dd/MM/yyyy", new Date());
    const formatedDate = format(parcedDate, "yyyy-MM-dd");
    try {
        await connection.query(`
            INSERT INTO Pacientes
                (nombre, apellido, fecha_nacimiento, telefono, correo_electronico, direccion, id_psicologo)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
        `, [nombre, apellido, formatedDate, telefono, correo_electronico, direccion, userId]);
        res.status(201).json({ message: "Paciente creado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//actualizar un paciente con fecha de nacimiento en formato yyyy-mm-dd
export const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, telefono, correo_electronico, direccion } = req.body;
    const parcedDate = parse(fecha_nacimiento, "dd/MM/yyyy", new Date());
    const formatedDate = format(parcedDate, "yyyy-MM-dd");
    try {
        await connection.query(`
            UPDATE Pacientes
            SET
                nombre = ?,
                apellido = ?,
                fecha_nacimiento = ?,
                telefono = ?,
                correo_electronico = ?,
                direccion = ?
            WHERE
                id_paciente = ?
        `, [nombre, apellido, formatedDate, telefono, correo_electronico, direccion, id]);
        res.status(200).json({ message: "Paciente actualizado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//eliminar un paciente
export const deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query(`
            DELETE FROM Pacientes
            WHERE id_paciente = ?
        `, [id]);
        res.status(200).json({ message: "Paciente eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};