export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public isCustom: boolean,
    public userId: string | null,
    public readonly createdAt?: Date,
  ) {}

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      isCustom: this.isCustom,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
