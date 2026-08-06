import { Request, Response, NextFunction } from 'express';
// Note: If you see TS errors about 'media' not existing on PropertyInclude, please run 'TypeScript: Restart TS server' in VS Code.
import prisma from '../utils/prisma';
import { z } from 'zod';
import { LeadSource, LeadStage, LeadScore } from '@prisma/client';

export class PublicController {
  static async getProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 12, type, city, minPrice, maxPrice, bedrooms } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      const where: any = { 
        status: 'PUBLISHED',
        deletedAt: null
      };
      
      if (type) where.type = type;
      if (city) where.city = { contains: String(city), mode: 'insensitive' };
      if (bedrooms) where.bedrooms = { gte: Number(bedrooms) };
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: { media: true }
        }),
        prisma.property.count({ where })
      ]);

      const mappedProperties = properties.map((p: any) => ({
        ...p,
        images: p.media?.filter((m: any) => m.mediaType === 'IMAGE') || [],
        videos: p.media?.filter((m: any) => m.mediaType === 'VIDEO') || [],
      }));

      res.status(200).json({
        status: 'success',
        data: {
          properties: mappedProperties,
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

  static async getPropertyBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const property = await prisma.property.findUnique({
        where: { slug: slug as string },
        include: { media: true, amenities: true, documents: true }
      });
      
      if (!property) return res.status(404).json({ status: 'error', message: 'Property not found' });
      
      const mappedProperty = {
        ...property,
        images: (property as any).media?.filter((m: any) => m.mediaType === 'IMAGE') || [],
        videos: (property as any).media?.filter((m: any) => m.mediaType === 'VIDEO') || [],
      };

      res.status(200).json({ status: 'success', data: { property: mappedProperty } });
    } catch (error) {
      next(error);
    }
  }

  static async submitInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        message: z.string(),
        propertyId: z.string().uuid().optional(),
        type: z.enum(['GENERAL', 'SITE_VISIT', 'BROKER_CONTACT'])
      });
      
      const data = schema.parse(req.body);
      
      // Upsert client based on phone/email
      let client = await prisma.client.findFirst({
        where: { OR: [{ email: data.email }, { phone: data.phone }] }
      });
      
      if (!client) {
        client = await prisma.client.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            source: LeadSource.CUSTOM,
            customSource: 'Website Form',
            stage: LeadStage.NEW_LEAD,
            score: LeadScore.WARM
          }
        });
      }
      
      // Log the inquiry activity
      await prisma.clientActivity.create({
        data: {
          clientId: client.id,
          type: 'WEBSITE_INQUIRY',
          description: `Received inquiry type: ${data.type}. Message: ${data.message} ${data.propertyId ? `for property ${data.propertyId}` : ''}`
        }
      });
      
      res.status(201).json({ status: 'success', message: 'Inquiry submitted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        title: z.string().min(3),
        description: z.string(),
        type: z.enum(['FLAT', 'HOUSE', 'LAND', 'COMMERCIAL', 'VILLA', 'APARTMENT']),
        price: z.number().positive(),
        location: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        areaSqFt: z.number().positive(),
        media: z.array(z.object({
          url: z.string().url(),
          mediaType: z.enum(['IMAGE', 'VIDEO']),
          fileName: z.string().optional(),
          mimeType: z.string().optional(),
          fileSize: z.number().optional()
        })).optional()
      });

      const data = schema.parse(req.body);
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(7);

      const property = await prisma.property.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          type: data.type,
          status: 'PUBLISHED',
          price: data.price,
          location: data.location,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          areaSqFt: data.areaSqFt,
          media: data.media && data.media.length > 0 ? {
            create: data.media.map(m => ({
              url: m.url,
              mediaType: m.mediaType,
              fileName: m.fileName || 'media_file',
              mimeType: m.mimeType || 'image/jpeg',
              fileSize: m.fileSize || 0
            }))
          } : undefined
        },
        include: { media: true }
      });

      res.status(201).json({ status: 'success', data: { property } });
    } catch (error) {
      next(error);
    }
  }
}
