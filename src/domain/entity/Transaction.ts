export type TransactionType = "INCOME" | "EXPENSE";

export class Transaction {
  constructor(
    public readonly id: string,
    public description: string,
    public amount: number,
    public type: TransactionType | string,
    public date: Date,
    public categoryId: string,
    public userId: string,
    public readonly createdAt?: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.description || !this.description.trim()) {
      throw new Error("A descrição da transação é obrigatória.");
    }
    if (this.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero.");
    }
    const validTypes = ["INCOME", "EXPENSE"];
    if (!validTypes.includes(this.type.toUpperCase())) {
      throw new Error(
        "O tipo da transação deve ser 'INCOME' (Receita) ou 'EXPENSE' (Despesa).",
      );
    }
    this.type = this.type.toUpperCase();
  }

  public toJSON() {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      type: this.type,
      date: this.date,
      categoryId: this.categoryId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
