import MongoDB from './db/mongoose';
import userRouter from './routers/User';
import taskRouter from './routers/Task';
import env from 'dotenv';
env.config();
import express from 'express';
import http from 'http';
import cors from 'cors';
const PORT =  process.env.PORT || 5000;

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASS)}@test.lvhnd.mongodb.net`;
const dbName = "tasks";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(userRouter)
app.use(taskRouter);

// Database Connection
MongoDB(dbURL, dbName);

server.listen(PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`Listening on Port: ${PORT}`)
})


