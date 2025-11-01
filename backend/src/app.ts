import express from 'express';
import cors from "cors";
import routerUser from './routes/routeUser';
import routerMedia from './routes/routeMedia';
const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.get('/ping', (_, res) => res.send('pong'));

app.use('/user', routerUser);
app.use('/calcular', routerMedia)

export default app;
