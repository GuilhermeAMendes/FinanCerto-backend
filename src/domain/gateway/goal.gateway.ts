import { Goal } from "../entity/Goal.js";

export interface GoalGateway {
  findAllByUserId(userId: string): Promise<Goal[]>;
  findByIdAndUserId(id: string, userId: string): Promise<Goal | null>;
  findByUserIdAndCategoryId(
    userId: string,
    categoryId: string,
  ): Promise<Goal | null>;
  create(data: {
    amount: number;
    categoryId: string;
    userId: string;
  }): Promise<Goal>;
  update(
    id: string,
    data: { amount?: number; categoryId?: string },
  ): Promise<Goal>;
  delete(id: string, userId: string): Promise<number>;
}
