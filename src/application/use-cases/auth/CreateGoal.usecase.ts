import { GoalGateway } from "@/domain/gateway/goal.gateway.js";

export class CreateGoalUseCase {
  constructor(
    private goalGateway: GoalGateway,
    private categoryGateway: CategoryGateway,
  ) {}

  async execute(userId: string, categoryId: string, amount: number) {
    const category = await this.categoryGateway.findByIdAndUserIdOrGlobal(
      categoryId,
      userId,
    );
    if (!category) {
      throw new Error("Categoria não encontrada ou sem acesso.");
    }

    const existingGoal = await this.goalGateway.findByUserIdAndCategoryId(
      userId,
      categoryId,
    );
    if (existingGoal) {
      throw new Error("Já existe um limite para esta categoria.");
    }

    const goal = await this.goalGateway.create({ amount, categoryId, userId });

    return goal.toJSON();
  }
}
