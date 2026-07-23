import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from '@/config/db';
import mainRouter from '@/api/routes/index';
import { generalLimiter, helloWorldLimiter } from '@/middlewares/rateLimiters';
import { sendError } from './utils/response';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectToDatabase();

const app: Express = express();

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use(generalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', (req, res) => {
    const ruta = path.resolve(__dirname, '../public/index.html');
    res.sendFile(ruta);
});

app.use('/api', mainRouter);

app.use('/hello', helloWorldLimiter, (req, res) => {
    console.log(req.headers);

    res.send('Hello World yes!');
});

// Controlador de rutas no encontradas
app.use((req, res, next) => {
    return sendError(res, 404, {
        i18n: 'not_found',
        message: 'Route not found',
        errors: {
            route: req.originalUrl,
        },
    });
});

// Controlador de errores generales del servidor
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('>>>> Server error:', error);
    return sendError(res, 500, {
        i18n: 'internal_server_error',
        message: 'Internal Server Error',
        errors: {
            message: error.message,
        },
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App running at: http://localhost:${PORT}`);
});

export default app;
