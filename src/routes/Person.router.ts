/**
 * Required External Modules and Interfaces
 */
 import express, { Router } from "express";
 import PersonController from "../controllers/Person.controller";


 /**
  * Router Definition
  */
 const personRouter: Router = express.Router();

 /**
  * Controller Definitions
  */
 // GET countries
 personRouter.get("/", PersonController.findAll);

 export default personRouter;
