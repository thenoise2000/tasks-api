import { Router } from "express";
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/userController";
const cors = require("cors");

const router = Router();
router.use(cors());

function defineUserRoutes() {
  router.get("/", getAllUsers);
  router.get("/:email", getUserByEmail);
  router.post("/", createUser);
  router.delete("/:id", deleteUser);
}

// Llamar a la función para definir las rutas
defineUserRoutes();

export default router;