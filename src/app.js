import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import PsicologosRoutes from './routes/psicologos.routes.js';
import CitasRoutes from './routes/citas.routes.js';
import PacientesRoutes from './routes/pacientes.routes.js';
import DiagnosticoRoutes from './routes/diagnosticos.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        message: 'biencenidos a la api de sarita que se conecta a la base de datos de mysql',
    });
    }
);

app.use(PsicologosRoutes);
app.use(CitasRoutes);
app.use(PacientesRoutes);
app.use(DiagnosticoRoutes);

export default app;