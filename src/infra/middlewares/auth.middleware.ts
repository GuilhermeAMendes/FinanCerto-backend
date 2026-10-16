import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;
  const secret = process.env.SECRET;

  if (!token || !secret) {
    res
      .status(401)
      .json({ error: "Token de autenticação ausente ou inválido." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { id?: string };
    if (!payload.id) {
      res.status(401).json({ error: "Token de autenticação inválido." });
      return;
    }
    res.locals.userId = payload.id;
    next();
  } catch {
    res
      .status(401)
      .json({ error: "Token de autenticação inválido ou expirado." });
  }
}
