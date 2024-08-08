import jwt from 'jsonwebtoken';

const tokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(403).json({ message: 'No hay token' });
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, 'secretkey');
        req.userId = decoded.id_psicologo;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
}

export default tokenMiddleware;