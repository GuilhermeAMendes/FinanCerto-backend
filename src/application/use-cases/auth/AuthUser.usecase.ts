import { UserRepository } from "../../../infra/repository/prisma/user.repository.js";
import { Bcrypt } from "../../../infra/services/cryptation/Bycript.js";
import { JwtToken } from "../../../infra/services/token/JwtToken.js";

export class AuthUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, passwordString: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Credenciais inválidas.");

    const passwordMatch = await Bcrypt.compare(passwordString, user.password);
    if (!passwordMatch) throw new Error("Credenciais inválidas.");

    const token = JwtToken.generate(user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
}
