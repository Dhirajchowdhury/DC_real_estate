import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export class AnalyticsController {
  static async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      // Parallel queries for fast KPI retrieval
      const [
        totalActiveProperties,
        totalSoldProperties,
        totalClients,
        newLeadsThisMonth,
        clientsBySource
      ] = await Promise.all([
        prisma.property.count({ where: { status: 'AVAILABLE', deletedAt: null } }),
        prisma.property.count({ where: { status: 'SOLD', deletedAt: null } }),
        prisma.client.count({ where: { deletedAt: null } }),
        prisma.client.count({
          where: {
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
            deletedAt: null
          }
        }),
        prisma.client.groupBy({
          by: ['source'],
          _count: { source: true },
          where: { deletedAt: null }
        })
      ]);

      const sourceDistribution = clientsBySource.map(item => ({
        name: item.source,
        value: item._count.source
      }));

      res.status(200).json({
        status: 'success',
        data: {
          kpis: {
            totalActiveProperties,
            totalSoldProperties,
            totalClients,
            newLeadsThisMonth
          },
          charts: {
            sourceDistribution
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
