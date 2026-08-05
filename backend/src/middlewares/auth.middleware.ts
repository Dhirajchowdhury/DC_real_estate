import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token format' });
    }
    const decoded = verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden - Insufficient permissions' });
    }

    next();
  };
};

export const requirePropertyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.params.propertyId || req.params.id;
    if (!propertyId) return res.status(400).json({ status: 'error', message: 'Property ID missing' });
    
    if (req.user?.role === 'SUPER_ADMIN') {
      return next(); // Super Admin can bypass
    }

    // We'll import prisma dynamically or at the top
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { brokerId: true }
    });

    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    if (property.brokerId !== req.user?.userId) {
      return res.status(403).json({ status: 'error', message: 'Forbidden - You do not own this property' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
