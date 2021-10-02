/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler } from "./middlewares/not-found.middleware";

/**
 * Required Routes
 */
import countriesRouter from "./routes/Country.router";
import authRouter from "./routes/Auth.router";
import userRouter from "./routes/User.router";
import personRouter from './routes/Person.router';

dotenv.config();
/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/country", countriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/person", personRouter);

app.use(notFoundHandler);

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
