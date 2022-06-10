import MongoDB from "./db/mongoose";
import userRouter from "./routers/User";
import taskRouter from "./routers/Task";
import env from "dotenv";
env.config();
import express from "express";
import https from "https";
import cors from "cors";
import errorHandler from "./middleware/error";

const PORT = process.env.PORT || 5000;

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASS
)}@test.lvhnd.mongodb.net`;
const dbName = "tasks";

const app = express();
const server = https.createServer(app);

app.use((req, res, next) => {
  if (process.env.inMaintenance === "true") {
    res.status(503).send("Site is currently down. Please try again later.");
    res.end();
  } else {
    next();
  }
});

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(userRouter);
app.use(taskRouter);

app.use(errorHandler);
// Database Connection
MongoDB(dbURL, dbName);

server.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on Port: ${PORT}`);
});
