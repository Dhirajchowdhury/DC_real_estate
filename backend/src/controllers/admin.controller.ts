import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { PropertyStatus, Role } from '@prisma/client';

export class AdminController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalProperties, publishedProperties, pendingBrokers, totalBrokers, unassignedLeads] = await Promise.all([
        prisma.property.count({ where: { deletedAt: null } }),
        prisma.property.count({ where: { status: PropertyStatus.PUBLISHED, deletedAt: null } }),
        prisma.brokerRequest.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { role: Role.BROKER, deletedAt: null } }),
        prisma.lead.count({ where: { brokerId: null } })
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          totalProperties,
          publishedProperties,
          pendingBrokers,
          pendingApprovals: pendingBrokers,
          totalBrokers,
          activeBrokers: totalBrokers,
          unassignedLeads
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingBrokerRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await prisma.brokerRequest.findMany({
        where: { status: 'PENDING' },
        include: { 
          user: { 
            select: { 
              id: true, 
              firstName: true, 
              lastName: true, 
              email: true, 
              phone: true, 
              companyName: true,
              username: true
            } 
          } 
        }
      });
      res.status(200).json({ status: 'success', data: { requests } });
    } catch (error) {
      next(error);
    }
  }

  static async approveBrokerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      
      const request = await prisma.brokerRequest.findUnique({ where: { id: requestId as string } });
      if (!request) return res.status(404).json({ status: 'error', message: 'Request not found' });

      await prisma.$transaction([
        prisma.brokerRequest.update({
          where: { id: requestId as string },
          data: { status: 'APPROVED' }
        }),
        prisma.user.update({
          where: { id: request.userId },
          data: { role: 'BROKER' }
        })
      ]);

      res.status(200).json({ status: 'success', message: 'Broker approved' });
    } catch (error) {
      next(error);
    }
  }

  static async rejectBrokerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;

      const request = await prisma.brokerRequest.findUnique({ where: { id: requestId as string } });
      if (!request) return res.status(404).json({ status: 'error', message: 'Request not found' });

      await prisma.brokerRequest.update({
        where: { id: requestId as string },
        data: { status: 'REJECTED' }
      });

      res.status(200).json({ status: 'success', message: 'Broker request rejected' });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          companyName: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json({ status: 'success', data: { users } });
    } catch (error) {
      next(error);
    }
  }

  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'User already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          phone: phone || null,
          role: 'ADMIN',
          isVerified: true,
          isActive: true
        },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
      });

      res.status(201).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: id as string } });
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      if (user.role === 'SUPER_ADMIN') {
        return res.status(403).json({ status: 'error', message: 'Cannot delete Super Admin' });
      }

      await prisma.user.update({
        where: { id: id as string },
        data: { deletedAt: new Date(), isActive: false }
      });

      res.status(200).json({ status: 'success', message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!['ADMIN', 'BROKER', 'CUSTOMER'].includes(role)) {
        return res.status(400).json({ status: 'error', message: 'Invalid role specified' });
      }

      const user = await prisma.user.findUnique({ where: { id: id as string } });
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      if (user.role === 'SUPER_ADMIN') {
        return res.status(403).json({ status: 'error', message: 'Cannot modify Super Admin role' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: { role },
        select: { id: true, email: true, firstName: true, lastName: true, role: true }
      });

      res.status(200).json({ status: 'success', data: { user: updatedUser } });
    } catch (error) {
      next(error);
    }
  }

  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.systemSetting.findMany();
      res.status(200).json({ status: 'success', data: { settings } });
    } catch (error) {
      next(error);
    }
  }

  static async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { value, description } = req.body;

      const setting = await prisma.systemSetting.upsert({
        where: { key: key as string },
        update: { value, description },
        create: { key: key as string, value, description }
      });

      res.status(200).json({ status: 'success', data: { setting } });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await prisma.auditLog.findMany({
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      res.status(200).json({ status: 'success', data: { logs } });
    } catch (error) {
      next(error);
    }
  }
}
