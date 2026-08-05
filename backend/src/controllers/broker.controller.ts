import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export class BrokerController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const brokerId = req.user!.userId;
      
      const [totalProperties, activeLeads, publishedProperties] = await Promise.all([
        prisma.property.count({ where: { brokerId } }),
        prisma.lead.count({ where: { brokerId } }),
        prisma.property.count({ where: { brokerId, status: 'PUBLISHED' } })
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          totalProperties,
          activeLeads,
          publishedProperties
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const brokerId = req.user!.userId;
      const properties = await prisma.property.findMany({
        where: { brokerId },
        include: { media: true }
      });

      // Map media to images/videos for legacy compatibility if needed
      const mappedProperties = properties.map((p: any) => ({
        ...p,
        images: p.media?.filter((m: any) => m.mediaType === 'IMAGE') || [],
        videos: p.media?.filter((m: any) => m.mediaType === 'VIDEO') || [],
      }));

      res.status(200).json({ status: 'success', data: { properties: mappedProperties } });
    } catch (error) {
      next(error);
    }
  }
}
