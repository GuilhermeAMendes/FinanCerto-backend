import jwt from "jsonwebtoken";

export class JwtToken {
  static generate(userId: string): string {
    return jwt.sign({ id: userId }, process.env.SECRET as string, {
      expiresIn: "1d",
    });
  }
}
