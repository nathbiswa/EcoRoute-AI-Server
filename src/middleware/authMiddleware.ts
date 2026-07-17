import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose-cjs';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    console.error("CRITICAL: BETTER_AUTH_SECRET is not defined in environment variables!");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    // jose-cjs uses TextEncoder for the secret
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    req.user = payload; // Attach decoded payload to request
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
