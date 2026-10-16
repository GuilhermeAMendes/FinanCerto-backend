import { Transaction } from "../entity/Transaction.js";

export interface TransactionGateway {
  create(data: {
    description: string;
    amount: number;
    type: string;
    date: Date;
    categoryId: string;
    userId: string;
  }): Promise<Transaction>;

  findByIdAndUserId(id: string, userId: string): Promise<Transaction | null>;

  findAllByUserId(userId: string): Promise<Transaction[]>;

  update(
    id: string,
    userId: string,
    data: Partial<{
      description: string;
      amount: number;
      type: string;
      date: Date;
      categoryId: string;
    }>,
  ): Promise<Transaction>;

  delete(id: string, userId: string): Promise<number>;
}
