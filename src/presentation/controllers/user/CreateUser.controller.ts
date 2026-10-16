import { CreateUserUseCase } from "@/application/use-cases/user/CreateUser.usecase.js";
import { UserRepository } from "@/infra/repository/prisma/user.repository.js";
import { Request, Response } from "express";

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      const userRepository = new UserRepository();
      const createUserUseCase = new CreateUserUseCase(userRepository);

      const result = await createUserUseCase.execute(name, email, password);

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
