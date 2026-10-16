import { Router } from "express";
import { userRoutes } from "./user.routes.js";
import { authRoutes } from "./auth.routes.js";
import { goalRoutes } from "./goals.routes.js";
import { categoryRoutes } from "./category.routes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/goals", goalRoutes);
routes.use("/categories", categoryRoutes);

export { routes };
