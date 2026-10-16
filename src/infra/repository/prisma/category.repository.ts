import { CategoryGateway } from "@/domain/gateway/category.gateway.js";
import { prisma } from "./Prisma.js";
import { Category } from "@/domain/entity/Category.js";

export class CategoryRepository implements CategoryGateway {
  async findByIdAndUserIdOrGlobal(
    id: string,
    userId: string,
  ): Promise<Category | null> {
    const categoryPrisma = await prisma.category.findFirst({
      where: { id, OR: [{ userId }, { userId: null }] },
    });

    if (!categoryPrisma) return null;

    return new Category(
      categoryPrisma.id,
      categoryPrisma.name,
      categoryPrisma.isCustom,
      categoryPrisma.userId,
      categoryPrisma.createdAt,
    );
  }

  async create(data: {
    name: string;
    isCustom: boolean;
    userId: string;
  }): Promise<Category> {
    const categoryPrisma = await prisma.category.create({ data });

    return new Category(
      categoryPrisma.id,
      categoryPrisma.name,
      categoryPrisma.isCustom,
      categoryPrisma.userId,
      categoryPrisma.createdAt,
    );
  }

  async findAllByUserIdOrGlobal(userId: string): Promise<Category[]> {
    const categoriesPrisma = await prisma.category.findMany({
      where: { OR: [{ userId }, { userId: null }] },
    });

    return categoriesPrisma.map(
      (cat) =>
        new Category(cat.id, cat.name, cat.isCustom, cat.userId, cat.createdAt),
    );
  }
}
