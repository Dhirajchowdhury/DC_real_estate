import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import prisma from '../utils/prisma';
import { z } from 'zod';

const registerCustomerSchema = z.object({
  username: z.string().optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email().optional().or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const registerBrokerSchema = z.object({
  username: z.string().optional(),
  companyName: z.string().min(2, 'Company/Brokerage name required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email().optional().or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export class AuthController {
  static async registerCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerCustomerSchema.parse(req.body);
      const result = await AuthService.registerCustomer(data);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async registerBroker(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.companyName && req.body.phone) {
        const data = registerBrokerSchema.parse(req.body);
        const result = await AuthService.registerBroker(data);
        return res.status(201).json({
          status: 'success',
          message: result.message,
          data: result,
        });
      } else {
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName || 'Broker';
        const lastName = req.body.lastName || 'Partner';
        const companyName = req.body.companyName || 'Brokerage Agency';
        const phone = req.body.phone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        const result = await AuthService.registerBroker({
          email,
          password,
          firstName,
          lastName,
          companyName,
          phone,
        });

        return res.status(201).json({
          status: 'success',
          message: result.message,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = req.body.identifier || req.body.email;
      const password = req.body.password;

      if (!identifier || !password) {
        return res.status(400).json({ status: 'error', message: 'Identifier and password are required' });
      }

      const result = await AuthService.login(identifier, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
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
        where: { id: (req as any).user!.userId },
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          companyName: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          brokerRequests: {
            select: { status: true }
          }
        },
      });

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      let isApproved = true;
      if (user.role === 'BROKER') {
        const status = user.brokerRequests?.status;
        if (status === 'PENDING' || !status) {
          isApproved = false;
        }
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            ...user,
            isApproved
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
