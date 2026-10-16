import { requireAuthentication } from "@/infra/middlewares/auth.middleware.js";
import { GoalController } from "@/presentation/controllers/goal/Goal.controller.js";
import { Router } from "express";

const goalRoutes = Router();
const goalController = new GoalController();

goalRoutes.use(requireAuthentication);

/**
 * @swagger
 * tags:
 *   name: Metas e limites
 *   description: Gerenciamento de limites de gastos por categoria
 */

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Cadastra limite de gastos para uma categoria
 *     tags: [Metas e limites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, amount]
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "uuid-da-categoria-aqui"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Limite cadastrado com situação atual dos gastos
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe um limite para esta categoria
 *
 *   get:
 *     summary: Lista limites e situação dos gastos do usuário autenticado
 *     tags: [Metas e limites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de limites com total gasto, saldo restante e alerta
 */
goalRoutes.post("/", goalController.create.bind(goalController));
goalRoutes.get("/", goalController.getAll.bind(goalController));

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Consulta um limite específico
 *     tags: [Metas e limites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Limite com situação atual dos gastos
 *       404:
 *         description: Limite não encontrado
 *
 *   delete:
 *     summary: Exclui um limite
 *     tags: [Metas e limites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Limite excluído com sucesso
 *       404:
 *         description: Limite não encontrado
 */
goalRoutes.get("/:id", goalController.getById.bind(goalController));
goalRoutes.delete("/:id", goalController.delete.bind(goalController));

export { goalRoutes };
