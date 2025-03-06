import { Router } from "express";
import { register, login, logout } from "../controllers/auth.js";
import { validateAuth } from "../validation/auth.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validateAuth, register);
router.post("/login", validateAuth, login);
router.post("/logout", authenticate, logout);

export default router;
