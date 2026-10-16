import { Category } from "../entity/Category.js";

export interface CategoryGateway {
  findByIdAndUserIdOrGlobal(
    id: string,
    userId: string,
  ): Promise<Category | null>;
  create(data: {
    name: string;
    isCustom: boolean;
    userId: string;
  }): Promise<Category>;
  findAllByUserIdOrGlobal(userId: string): Promise<Category[]>;
}
