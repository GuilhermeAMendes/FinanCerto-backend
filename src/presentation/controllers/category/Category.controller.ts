import { CreateCategoryUseCase } from "@/application/use-cases/auth/CreateCategory.usecase.js";
import { CategoryRepository } from "@/infra/repository/prisma/category.repository.js";
import { Request, Response } from "express";

export class CategoryController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const { name } = req.body;

      const categoryRepo = new CategoryRepository();
      const useCase = new CreateCategoryUseCase(categoryRepo);

      const result = await useCase.execute(name, userId);

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId as string;
      const categoryRepo = new CategoryRepository();

      const categories = await categoryRepo.findAllByUserIdOrGlobal(userId);
      return res.status(200).json(categories.map((cat) => cat.toJSON()));
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Não foi possível listar as categorias." });
    }
  }
}
