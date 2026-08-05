import prisma from '../utils/prisma';
import { LeadScore, LeadStage, LeadSource } from '@prisma/client';

export interface CreateClientDTO {
  name: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  occupation?: string;
  source?: LeadSource;
  assignedToId?: string;
  remarks?: string;
}

export class ClientService {
  static async createClient(data: CreateClientDTO) {
    return prisma.client.create({
      data: {
        ...data,
        stage: LeadStage.NEW_LEAD,
        score: LeadScore.COLD,
      },
    });
  }

  static async getClients(filters: any = {}, skip: number = 0, take: number = 20) {
    const where: any = { deletedAt: null };
    
    if (filters.stage) where.stage = filters.stage;
    if (filters.source) where.source = filters.source;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.score) where.score = filters.score;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          tags: true,
        },
      }),
      prisma.client.count({ where }),
    ]);

    return { clients, total };
  }

  static async getClientById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        requirements: true,
        activities: { orderBy: { timestamp: 'desc' }, take: 50 },
        followUps: { orderBy: { scheduledFor: 'asc' }, take: 10 },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        tags: true,
      },
    });
  }

  static async updateClientStage(id: string, stage: LeadStage, userId: string) {
    const client = await prisma.client.update({
      where: { id },
      data: { stage },
    });

    await prisma.clientActivity.create({
      data: {
        clientId: id,
        userId,
        type: 'STAGE_CHANGE',
        description: `Lead stage changed to ${stage}`,
      }
    });

    return client;
  }
}
