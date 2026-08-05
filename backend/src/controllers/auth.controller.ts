import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import prisma from '../utils/prisma';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        return res.status(401).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized - No refresh token' });
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid refresh token' });
      }

      const accessToken = generateAccessToken({ userId: user.id, role: user.role });
      
      res.status(200).json({
        status: 'success',
        data: { accessToken },
      });
    } catch (error) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        // Optional: clear it from DB
        await prisma.user.updateMany({
          where: { refreshToken },
          data: { refreshToken: null },
        });
      }

      res.clearCookie('refreshToken');
      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
        },
      });

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }
}
