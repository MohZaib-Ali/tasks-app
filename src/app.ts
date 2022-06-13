import MongoDB from "./db/mongoose";
import userRouter from "./routers/User";
import taskRouter from "./routers/Task";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error";

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASS
)}@test.lvhnd.mongodb.net`;

const app = express();

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
MongoDB(dbURL);

export default app;