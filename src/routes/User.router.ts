/**
 * Required External Modules and Interfaces
 */
import express from "express";
import UserController from "../controllers/User.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";
/**
 * Router Controller
 */
const userRouter = express.Router();

/**
 * Controller definitions
 */
// GET users
userRouter.get("/", verifyJwt, UserController.findAll);

// GET user/:id
userRouter.get("/:id", verifyJwt, UserController.findById);

// POST user
userRouter.post("/", verifyJwt, UserController.create);

// PUT user/:id
userRouter.put("/:id", verifyJwt, UserController.update);

// DELETE user/:id
userRouter.delete("/:id", verifyJwt, UserController.delete);

export default userRouter;
