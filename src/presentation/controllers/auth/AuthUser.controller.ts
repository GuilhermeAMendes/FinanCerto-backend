import { Request, Response } from "express";
import { AuthUserUseCase } from "@/application/use-cases/auth/AuthUser.usecase.js";
import { UserRepository } from "@/infra/repository/prisma/user.repository.js";

export class AuthUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const userRepository = new UserRepository();
      const authUserUseCase = new AuthUserUseCase(userRepository);

      const result = await authUserUseCase.execute(email, password);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
