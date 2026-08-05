import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export class AdminController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalProperties, publishedProperties, pendingBrokers, totalBrokers, unassignedLeads] = await Promise.all([
        prisma.property.count(),
        prisma.property.count({ where: { status: 'PUBLISHED' } }),
        prisma.brokerRequest.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { role: 'BROKER' } }),
        prisma.lead.count({ where: { brokerId: null } })
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          totalProperties,
          publishedProperties,
          pendingBrokers,
          totalBrokers,
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
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
      });
      res.status(200).json({ status: 'success', data: { requests } });
    } catch (error) {
      next(error);
    }
  }

  static async approveBrokerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      
      const request = await prisma.brokerRequest.findUnique({ where: { id: requestId } });
      if (!request) return res.status(404).json({ status: 'error', message: 'Request not found' });

      await prisma.$transaction([
        prisma.brokerRequest.update({
          where: { id: requestId },
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
}
