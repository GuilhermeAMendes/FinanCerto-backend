import { Router } from "express";
import { AuthUserController } from "../../../../presentation/controllers/auth/AuthUser.controller.js";

const authRoutes = Router();
const authUserController = new AuthUserController();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login e geração de tokens
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna o Token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: guilherme@email.com
 *               password:
 *                 type: string
 *                 example: senhaSuperForte123
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post("/login", authUserController.handle.bind(authUserController));

export { authRoutes };
