// Required External Modules
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler } from "./middlewares/not-found.middleware";

// Required Routes
import countriesRouter from "./routes/Country.router";
import authRouter from "./routes/Auth.router";
import userRouter from "./routes/User.router";
import personRouter from './routes/Person.router';

// config env variables
dotenv.config();

// App Variables
if (!process.env.PORT) {
  process.exit(1);
}

// get port
const PORT: number = parseInt(process.env.PORT as string, 10);

// init express
const app = express();

// App Configuration
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * country route @CountryController
 */
app.use("/api/country", countriesRouter);
/**
 * auth route @AuthController
 */
app.use("/api/auth", authRouter);
/**
 * user route @UserController
 */
app.use("/api/user", userRouter);
/**
 * person route @PersonController
 */
app.use("/api/person", personRouter);

/**
 * If any route match, call not found handler
 */
app.use(notFoundHandler);

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
