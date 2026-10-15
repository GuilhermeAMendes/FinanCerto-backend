import { Router } from "express";
import { CreateUserController } from "@/presentation/controllers/user/CreateUser.controller.js";

const userRoutes = Router();
const createUserController = new CreateUserController();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário (Registro)
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Guilherme Mendes
 *               email:
 *                 type: string
 *                 example: guilherme@email.com
 *               password:
 *                 type: string
 *                 example: senhaSuperForte123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação ou usuário já existente
 */
userRoutes.post("/", createUserController.handle.bind(createUserController));

export { userRoutes };
