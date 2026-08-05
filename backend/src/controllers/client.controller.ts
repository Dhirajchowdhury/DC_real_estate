import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/client.service';
import { LeadStage, LeadSource } from '@prisma/client';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  occupation: z.string().optional(),
  source: z.nativeEnum(LeadSource).optional(),
  assignedToId: z.string().uuid().optional(),
  remarks: z.string().optional(),
});

export class ClientController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createClientSchema.parse(req.body);
      const client = await ClientService.createClient(data);
      res.status(201).json({ status: 'success', data: { client } });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, stage, source, search, assignedToId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      const { clients, total } = await ClientService.getClients(
        { stage, source, search, assignedToId },
        skip,
        Number(limit)
      );

      res.status(200).json({
        status: 'success',
        data: {
          clients,
          meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await ClientService.getClientById(id);
      
      if (!client) {
        return res.status(404).json({ status: 'error', message: 'Client not found' });
      }

      res.status(200).json({ status: 'success', data: { client } });
    } catch (error) {
      next(error);
    }
  }

  static async updateStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stage } = z.object({ stage: z.nativeEnum(LeadStage) }).parse(req.body);
      
      const client = await ClientService.updateStage(id, stage, req.user!.userId);
      res.status(200).json({ status: 'success', data: { client } });
    } catch (error) {
      next(error);
    }
  }
}
