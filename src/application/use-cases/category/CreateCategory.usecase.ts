import { CategoryGateway } from "@/domain/gateway/category.gateway.js";

export class CreateCategoryUseCase {
  constructor(private categoryGateway: CategoryGateway) {}

  async execute(name: string, userId: string) {
    if (!name || !name.trim()) {
      throw new Error("O nome da categoria é obrigatório.");
    }

    const category = await this.categoryGateway.create({
      name: name.trim(),
      isCustom: true,
      userId,
    });

    return category.toJSON();
  }
}
