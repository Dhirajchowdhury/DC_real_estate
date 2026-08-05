import { Request, Response, NextFunction } from 'express';
import { CalendarService } from '../services/calendar.service';
import { z } from 'zod';
import { EventType } from '@prisma/client';

export class CalendarController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.nativeEnum(EventType),
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        isAllDay: z.boolean().optional(),
        color: z.string().optional(),
        clientId: z.string().uuid().optional(),
        propertyId: z.string().uuid().optional(),
      });
      const data = schema.parse(req.body);
      const event = await CalendarService.createEvent(data, req.user!.userId);
      res.status(201).json({ status: 'success', data: { event } });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;
      if (!start || !end) return res.status(400).json({ status: 'error', message: 'start and end dates are required' });
      
      const events = await CalendarService.getEvents(req.user!.userId, new Date(start as string), new Date(end as string));
      res.status(200).json({ status: 'success', data: { events } });
    } catch (error) {
      next(error);
    }
  }
}
