import { User } from "@/domain/entity/User.js";
import { UserGateway } from "@/domain/gateway/user.gateway.js";
import { prisma } from "@/infra/repository/prisma/Prisma.js";

export class UserRepository implements UserGateway {
  async findByEmail(email: string): Promise<User | null> {
    const userPrisma = await prisma.user.findUnique({ where: { email } });

    if (!userPrisma) return null;

    return new User(
      userPrisma.id,
      userPrisma.name,
      userPrisma.email,
      userPrisma.password,
      userPrisma.createdAt,
      userPrisma.updatedAt,
    );
  }

  async create(data: {
    name: string;
    email: string;
    password?: string;
  }): Promise<User> {
    const userPrisma = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || "",
      },
    });

    return new User(
      userPrisma.id,
      userPrisma.name,
      userPrisma.email,
      userPrisma.password,
      userPrisma.createdAt,
      userPrisma.updatedAt,
    );
  }
}
