import express from 'express';
import router from './src/routers/index.js';
import { PORT } from './src/config.js';

const app = express();

router.get('/root', (req, res) => { res.status(200).send('Hello World'); });
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`This server is running on port ${PORT}`));

export default app;
