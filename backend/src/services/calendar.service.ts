import prisma from '../utils/prisma';
import { EventType } from '@prisma/client';

export class CalendarService {
  static async createEvent(data: any, userId: string) {
    return prisma.calendarEvent.create({
      data: {
        ...data,
        userId,
      },
      include: {
        client: { select: { name: true } },
        property: { select: { title: true } },
      }
    });
  }

  static async getEvents(userId: string, start: Date, end: Date) {
    return prisma.calendarEvent.findMany({
      where: {
        userId,
        startTime: { gte: start },
        endTime: { lte: end }
      },
      include: {
        client: { select: { name: true } },
        property: { select: { title: true } },
      }
    });
  }

  static async updateEvent(id: string, data: any, userId: string) {
    return prisma.calendarEvent.update({
      where: { id, userId },
      data,
    });
  }

  static async deleteEvent(id: string, userId: string) {
    return prisma.calendarEvent.delete({
      where: { id, userId },
    });
  }
}
