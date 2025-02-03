import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { jwtConfig } from '../config/jwt.config';
import bcrypt from 'bcrypt';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { service_number, password } = req.body;
      
      const officer = await prisma.officer.findUnique({
        where: { service_number }
      });

      if (!officer) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, officer.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          sub: officer.id,
          service_number: officer.service_number,
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
        officer:officer
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async validateToken(req: Request, res: Response) {
    return res.json({ officer: req.officer });
  }
} 