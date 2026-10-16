export type GoalAlertStatus = "within_limit" | "reached" | "exceeded";

export class Goal {
  public readonly remaining: number;
  public readonly alert: GoalAlertStatus;

  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly spent: number = 0,
  ) {
    this.validate();

    this.remaining = Math.max(this.amount - this.spent, 0);
    this.alert = this.calculateAlert();
  }

  private validate(): void {
    if (this.amount <= 0) {
      throw new Error("O limite da meta deve ser maior que zero.");
    }
    if (!this.categoryId.trim()) {
      throw new Error("A categoria informada é inválida.");
    }
  }

  private calculateAlert(): GoalAlertStatus {
    if (this.spent > this.amount) return "exceeded";
    if (this.spent === this.amount) return "reached";
    return "within_limit";
  }

  public toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      categoryId: this.categoryId,
      userId: this.userId,
      createdAt: this.createdAt,
      spent: this.spent,
      remaining: this.remaining,
      alert: this.alert,
    };
  }
}
