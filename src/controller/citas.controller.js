import { connection } from "../db/conection.js";
import { format, parse } from "date-fns";

//obtener todas las citas y formatear la fecha dd/mm/yyyy
export const getCitas = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                citas.id_cita,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                pacientes.tarifa,  -- Agregamos la tarifa del paciente
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                citas.fecha_cita,
                citas.hora_cita,
                citas.tipo_cita,
                citas.estado
            FROM 
                citas
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id_paciente
            JOIN 
            psicologos ON citas.id_psicologo = psicologos.id_psicologo
            WHERE 
                citas.id_psicologo = ?
        `, [userId]);

        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date(cita.fecha_cita), "dd/MM/yyyy");
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });

        res.status(200).json(rows);
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
                citas.id_cita,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                pacientes.tarifa,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                citas.fecha_cita,
                citas.hora_cita,
                citas.tipo_cita,
                citas.estado
            FROM 
                citas
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON citas.id_psicologo = psicologos.id_psicologo
            WHERE 
                citas.id_cita = ?
        `, [id]);
        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date (cita.fecha_cita), "dd/MM/yyyy");
            //formato de 24 horas
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
            INSERT INTO citas (id_paciente, id_psicologo, fecha_cita, hora_cita, tipo_cita)
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
            UPDATE citas
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
            DELETE FROM citas
            WHERE id_cita = ?
        `, [id]);
    
        res.status(200).json({ message: "Cita eliminada correctamente", rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//confirmar una cita
export const confirmCita = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query(`
            UPDATE citas SET estado = 'confirmada' WHERE id_cita = ?
        `, [id]);
        res.status(200).json({ message: "Cita confirmada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//obtener todas las citas de un paciente con que tenga la sesion iniciada
export const getCitasPacientes = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                citas.id_cita,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                citas.fecha_cita,
                citas.hora_cita,
                citas.tipo_cita,
                citas.estado
            FROM 
                citas
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON citas.id_psicologo = psicologos.id_psicologo
            WHERE 
                citas.id_paciente = ?
        `, [userId]);

        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date(cita.fecha_cita), "dd/MM/yyyy");
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//citas que tiene un psiocologo del dia de hoy
export const getCitasHoy = async (req, res) => {
    const userId = req.userId;
    try {
        const [rows] = await connection.query(`
            SELECT
                citas.id_cita,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                citas.fecha_cita,
                citas.hora_cita,
                citas.tipo_cita,
                citas.estado
            FROM 
                citas
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON citas.id_psicologo = psicologos.id_psicologo
            WHERE 
                citas.id_psicologo = ? AND citas.fecha_cita = CURDATE()
        `, [userId]);

        rows.forEach((cita) => {
            cita.fecha_cita = format(new Date(cita.fecha_cita), "dd/MM/yyyy");
            cita.hora_cita = format(parse(cita.hora_cita, "HH:mm:ss", new Date()), "HH:mm");
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "No hay citas para hoy" });
        }

        return res.status(200).json(rows);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//filtrar citas por fecha
export const getCitasPorFecha = async (req, res) => {
    const userId = req.userId;
    const { fecha } = req.params;
    try {
        const [rows] = await connection.query(`
            SELECT
                citas.id_cita,
                pacientes.nombre AS nombre_paciente,
                pacientes.apellido AS apellido_paciente,
                psicologos.nombre AS nombre_psicologo,
                psicologos.apellido AS apellido_psicologo,
                citas.fecha_cita,
                citas.hora_cita,
                citas.tipo_cita,
                citas.estado
            FROM 
                citas
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id_paciente
            JOIN 
                psicologos ON citas.id_psicologo = psicologos.id_psicologo
            WHERE 
                citas.id_psicologo = ? AND citas.fecha_cita = ?
        `, [userId, fecha]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No hay citas para esta fecha" });
        }

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
