import { User } from "../entity/User.js";

export interface UserGateway {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    password?: string;
  }): Promise<User>;
}
