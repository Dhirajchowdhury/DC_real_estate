import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

export class AIController {
  // Mock AI Semantic Search endpoint
  static async searchProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ status: 'error', message: 'Query string is required' });
      }

      // MOCK LLM PARSING LOGIC
      // In production, we would pass 'query' to OpenAI or Gemini and extract JSON parameters.
      // For instance: "Show me 3 BHK flats under 60 lakhs in Rajarhat" 
      // -> { bedrooms: 3, type: "FLAT", maxPrice: 6000000, city: "Rajarhat" }
      
      let parsedFilters: any = {};
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('3 bhk')) parsedFilters.bedrooms = { gte: 3 };
      if (lowerQuery.includes('flat')) parsedFilters.type = 'FLAT';
      if (lowerQuery.includes('villa')) parsedFilters.type = 'VILLA';
      if (lowerQuery.includes('60 lakhs') || lowerQuery.includes('60 lakh')) parsedFilters.price = { lte: 6000000 };
      if (lowerQuery.includes('rajarhat')) parsedFilters.city = { contains: 'Rajarhat', mode: 'insensitive' };
      
      const properties = await prisma.property.findMany({
        where: parsedFilters,
        take: 5,
        include: { images: true }
      });

      res.status(200).json({
        status: 'success',
        data: {
          interpretedQuery: parsedFilters,
          results: properties
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // AI Recommendation Engine
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId } = req.params;
      
      const client = await prisma.client.findUnique({
        where: { id: clientId as string },
        include: { requirements: true }
      });
      
      if (!client || !client.requirements) {
        // Fallback to generic popular properties
        const popular = await prisma.property.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
        return res.status(200).json({ status: 'success', data: { recommendations: popular } });
      }

      const reqFilter = client.requirements;
      
      const recommendations = await prisma.property.findMany({
        where: {
          status: 'AVAILABLE',
          type: reqFilter.propertyTypes && reqFilter.propertyTypes.length > 0 ? { in: reqFilter.propertyTypes } : undefined,
          price: {
            gte: reqFilter.budgetMin ? Number(reqFilter.budgetMin) : undefined,
            lte: reqFilter.budgetMax ? Number(reqFilter.budgetMax) : undefined
          },
          city: reqFilter.preferredLocations && reqFilter.preferredLocations.length > 0 ? { in: reqFilter.preferredLocations } : undefined
        },
        take: 3,
        include: { images: true }
      });

      res.status(200).json({ status: 'success', data: { recommendations } });
    } catch (error) {
      next(error);
    }
  }
}
