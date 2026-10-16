import { Goal } from "@/domain/entity/Goal.js";
import { GoalGateway } from "@/domain/gateway/goal.gateway.js";
import { prisma } from "@/infra/repository/prisma/Prisma.js";

export class GoalRepository implements GoalGateway {
  private async getSpentAmount(
    userId: string,
    categoryId: string,
  ): Promise<number> {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        type: { in: ["EXPENSE", "despesa", "saida"] },
      },
      select: { amount: true },
    });
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  }

  async findAllByUserId(userId: string): Promise<Goal[]> {
    const goalsPrisma = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return Promise.all(
      goalsPrisma.map(async (goalPrisma) => {
        const spent = await this.getSpentAmount(userId, goalPrisma.categoryId);
        return new Goal(
          goalPrisma.id,
          goalPrisma.amount,
          goalPrisma.categoryId,
          goalPrisma.userId,
          goalPrisma.createdAt,
          spent,
        );
      }),
    );
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Goal | null> {
    const goalPrisma = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goalPrisma) return null;

    const spent = await this.getSpentAmount(userId, goalPrisma.categoryId);

    return new Goal(
      goalPrisma.id,
      goalPrisma.amount,
      goalPrisma.categoryId,
      goalPrisma.userId,
      goalPrisma.createdAt,
      spent,
    );
  }

  async findByUserIdAndCategoryId(
    userId: string,
    categoryId: string,
  ): Promise<Goal | null> {
    const goalPrisma = await prisma.goal.findFirst({
      where: { userId, categoryId },
    });

    if (!goalPrisma) return null;

    const spent = await this.getSpentAmount(userId, categoryId);

    return new Goal(
      goalPrisma.id,
      goalPrisma.amount,
      goalPrisma.categoryId,
      goalPrisma.userId,
      goalPrisma.createdAt,
      spent,
    );
  }

  async create(data: {
    amount: number;
    categoryId: string;
    userId: string;
  }): Promise<Goal> {
    const goalPrisma = await prisma.goal.create({ data });
    const spent = await this.getSpentAmount(data.userId, data.categoryId);

    return new Goal(
      goalPrisma.id,
      goalPrisma.amount,
      goalPrisma.categoryId,
      goalPrisma.userId,
      goalPrisma.createdAt,
      spent,
    );
  }

  async update(
    id: string,
    data: { amount?: number; categoryId?: string },
  ): Promise<Goal> {
    const goalPrisma = await prisma.goal.update({
      where: { id },
      data,
    });

    const spent = await this.getSpentAmount(
      goalPrisma.userId,
      goalPrisma.categoryId,
    );

    return new Goal(
      goalPrisma.id,
      goalPrisma.amount,
      goalPrisma.categoryId,
      goalPrisma.userId,
      goalPrisma.createdAt,
      spent,
    );
  }

  async delete(id: string, userId: string): Promise<number> {
    const result = await prisma.goal.deleteMany({
      where: { id, userId },
    });
    return result.count;
  }
}
