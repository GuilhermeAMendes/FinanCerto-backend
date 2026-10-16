import { CreateGoalUseCase } from "@/application/use-cases/goal/CreateGoal.usecase.js";
import { CategoryRepository } from "@/infra/repository/prisma/category.repository.js";
import { GoalRepository } from "@/infra/repository/prisma/goal.repository.js";
import { Request, Response } from "express";

export class GoalController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const { categoryId, amount } = req.body;

      const goalRepo = new GoalRepository();
      const categoryRepo = new CategoryRepository();
      const useCase = new CreateGoalUseCase(goalRepo, categoryRepo);

      const result = await useCase.execute(userId, categoryId, amount);

      return res.status(201).json(result);
    } catch (error: any) {
      const status = error.message.includes("Já existe") ? 409 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const goalRepo = new GoalRepository();

      const goals = await goalRepo.findAllByUserId(userId);
      return res.status(200).json(goals.map((goal) => goal.toJSON()));
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Não foi possível consultar os limites." });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const id = String(req.params.id);
      const goalRepo = new GoalRepository();

      const goal = await goalRepo.findByIdAndUserId(id, userId);
      if (!goal)
        return res.status(404).json({ error: "Limite não encontrado." });

      return res.status(200).json(goal.toJSON());
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Não foi possível consultar o limite." });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const id = String(req.params.id);
      const goalRepo = new GoalRepository();

      const deletedCount = await goalRepo.delete(id, userId);
      if (deletedCount === 0)
        return res.status(404).json({ error: "Limite não encontrado." });

      return res.status(204).send();
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Não foi possível excluir o limite." });
    }
  }
}
