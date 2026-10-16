import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@/infra/repository/prisma/Prisma.js";

const goalRoutes = Router();

function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;
  const secret = process.env.SECRET;

  if (!token || !secret) {
    res.status(401).json({ error: "Token de autenticação ausente ou inválido." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { id?: unknown };
    if (typeof payload.id !== "string") {
      res.status(401).json({ error: "Token de autenticação inválido." });
      return;
    }
    res.locals.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: "Token de autenticação inválido ou expirado." });
  }
}

function userIdFrom(res: Response): string {
  return res.locals.userId as string;
}

async function withSpendingStatus(goal: {
  id: string;
  amount: number;
  categoryId: string;
  userId: string;
  createdAt: Date;
}) {
  const transactions = await prisma.transaction.findMany({
    where: { userId: goal.userId, categoryId: goal.categoryId },
    select: { amount: true, type: true },
  });

  const expenseTypes = [
    "despesa",
    "despesas",
    "expense",
    "expenses",
    "saida",
    "saída",
    "outflow",
  ];
  const spent = transactions.reduce((total, transaction) => {
    const type = transaction.type.trim().toLocaleLowerCase("pt-BR");
    return expenseTypes.includes(type) ? total + transaction.amount : total;
  }, 0);

  return {
    ...goal,
    spent,
    remaining: Math.max(goal.amount - spent, 0),
    alert:
      spent >= goal.amount
        ? spent > goal.amount
          ? "exceeded"
          : "reached"
        : "within_limit",
  };
}

/**
 * @swagger
 * tags:
 *   name: Metas e limites
 *   description: Limites de gastos por categoria
 * /goals:
 *   get:
 *     summary: Lista limites e situação dos gastos do usuário autenticado
 *     tags: [Metas e limites]
 *     responses:
 *       200:
 *         description: Lista de limites com total gasto, saldo restante e alerta
 *   post:
 *     summary: Cadastra limite de gastos para uma categoria
 *     tags: [Metas e limites]
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
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Limite cadastrado com situação atual dos gastos
 * /goals/{id}:
 *   get:
 *     summary: Consulta um limite
 *     tags: [Metas e limites]
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
 *   put:
 *     summary: Atualiza um limite
 *     tags: [Metas e limites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Limite atualizado
 *   delete:
 *     summary: Exclui um limite
 *     tags: [Metas e limites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Limite excluído
 */
goalRoutes.use(requireAuthentication);

goalRoutes.get("/", async (_req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: userIdFrom(res) },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(await Promise.all(goals.map(withSpendingStatus)));
  } catch {
    return res.status(500).json({ error: "Não foi possível consultar os limites." });
  }
});

goalRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const goal = await prisma.goal.findFirst({
      where: { id: String(req.params.id), userId: userIdFrom(res) },
      include: { category: true },
    });
    if (!goal) return res.status(404).json({ error: "Limite não encontrado." });
    return res.json(await withSpendingStatus(goal));
  } catch {
    return res.status(500).json({ error: "Não foi possível consultar o limite." });
  }
});

goalRoutes.post("/", async (req: Request, res: Response) => {
  const { categoryId, amount } = req.body ?? {};
  if (
    typeof categoryId !== "string" ||
    !categoryId.trim() ||
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({
      error: "Informe uma categoria e um limite maior que zero.",
    });
  }

  try {
    const userId = userIdFrom(res);
    const category = await prisma.category.findFirst({
      where: { id: categoryId, OR: [{ userId }, { userId: null }] },
    });
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada ou sem acesso." });
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { userId, categoryId },
    });
    if (existingGoal) {
      return res.status(409).json({
        error: "Já existe um limite para esta categoria.",
      });
    }

    const goal = await prisma.goal.create({
      data: { amount, categoryId, userId },
      include: { category: true },
    });
    return res.status(201).json(await withSpendingStatus(goal));
  } catch {
    return res.status(500).json({ error: "Não foi possível cadastrar o limite." });
  }
});

goalRoutes.put("/:id", async (req: Request, res: Response) => {
  const { categoryId, amount } = req.body ?? {};
  if (
    amount !== undefined &&
    (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0)
  ) {
    return res.status(400).json({ error: "O limite deve ser um número maior que zero." });
  }
  if (
    categoryId !== undefined &&
    (typeof categoryId !== "string" || !categoryId.trim())
  ) {
    return res.status(400).json({ error: "A categoria informada é inválida." });
  }
  if (amount === undefined && categoryId === undefined) {
    return res.status(400).json({
      error: "Informe o novo limite e/ou categoria.",
    });
  }

  try {
    const userId = userIdFrom(res);
    const id = String(req.params.id);
    const current = await prisma.goal.findFirst({ where: { id, userId } });
    if (!current) return res.status(404).json({ error: "Limite não encontrado." });

    const nextCategoryId = categoryId ?? current.categoryId;
    const category = await prisma.category.findFirst({
      where: { id: nextCategoryId, OR: [{ userId }, { userId: null }] },
    });
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada ou sem acesso." });
    }

    const duplicate = await prisma.goal.findFirst({
      where: { userId, categoryId: nextCategoryId, NOT: { id } },
    });
    if (duplicate) {
      return res.status(409).json({
        error: "Já existe um limite para esta categoria.",
      });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(amount !== undefined ? { amount } : {}),
        categoryId: nextCategoryId,
      },
      include: { category: true },
    });
    return res.json(await withSpendingStatus(goal));
  } catch {
    return res.status(500).json({ error: "Não foi possível atualizar o limite." });
  }
});

goalRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.goal.deleteMany({
      where: { id: String(req.params.id), userId: userIdFrom(res) },
    });
    if (result.count === 0) {
      return res.status(404).json({ error: "Limite não encontrado." });
    }
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Não foi possível excluir o limite." });
  }
});

export { goalRoutes };
