import { UserRepository } from "@/infra/repository/prisma/user.repository.js";
import { Bcrypt } from "@/infra/services/cryptation/Bycript.js";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, passwordString: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Usuário já cadastrado com este email.");
    }

    const hashedPassword = await Bcrypt.hash(passwordString);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
