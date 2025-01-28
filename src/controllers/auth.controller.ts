import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { jwtConfig } from '../config/jwt.config';
import bcrypt from 'bcrypt';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password ,telephone} = req.body;
      
      const user = await prisma.user.findUnique({
        where: { telephone }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
        //   role: user.role
        },
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.expiresIn,
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience,
        }
      );

      return res.json({
        token,
        user:user
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async validateToken(req: Request, res: Response) {
    return res.json({ user: req.user });
  }
} 