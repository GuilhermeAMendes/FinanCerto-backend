import { requireAuthentication } from "@/infra/middlewares/auth.middleware.js";
import { CategoryController } from "@/presentation/controllers/category/Category.controller.js";
import { Router } from "express";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.use(requireAuthentication);

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias de gastos
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria customizada para o usuário
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lazer"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *
 *   get:
 *     summary: Lista todas as categorias (globais + customizadas do usuário)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
categoryRoutes.post("/", categoryController.create.bind(categoryController));
categoryRoutes.get("/", categoryController.getAll.bind(categoryController));

export { categoryRoutes };
