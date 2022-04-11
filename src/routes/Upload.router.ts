/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import UploadController from "../controllers/Upload.controller";

/**
 * Router Definition
 */
const uploadRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// POST upload
uploadRouter.post("/", UploadController.upload);

export default uploadRouter;
