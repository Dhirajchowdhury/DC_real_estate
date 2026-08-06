import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthService {
  static async registerCustomer(data: {
    username?: string;
    phone: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    // Check if phone or email or username exists
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingEmail) throw new Error('Email address is already registered');
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) throw new Error('Phone number is already registered');

    if (data.username) {
      const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
      if (existingUsername) throw new Error('Username is already taken');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const email = data.email || `${data.phone}@customer.dcrealestate.com`;
    const username = data.username || `user_${data.phone.slice(-4)}`;
    const firstName = data.firstName || username;
    const lastName = data.lastName || 'Customer';

    const user = await prisma.user.create({
      data: {
        email,
        username,
        phone: data.phone,
        passwordHash,
        firstName,
        lastName,
        role: 'CUSTOMER',
        isVerified: true,
      },
    });

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isApproved: true,
      },
      accessToken,
      refreshToken,
    };
  }

  static async registerBroker(data: {
    username?: string;
    companyName: string;
    phone: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    if (data.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingEmail) throw new Error('Email address is already registered');
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) throw new Error('Phone number is already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const email = data.email || `${data.phone}@broker.dcrealestate.com`;
    const username = data.username || `broker_${data.phone.slice(-4)}`;
    const firstName = data.firstName || username;
    const lastName = data.lastName || 'Broker';

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          phone: data.phone,
          companyName: data.companyName,
          passwordHash,
          firstName,
          lastName,
          role: 'BROKER',
          isVerified: true,
        },
      });

      const brokerReq = await tx.brokerRequest.create({
        data: {
          userId: user.id,
          status: 'PENDING',
        },
      });

      return { user, brokerReq };
    });

    return {
      message: 'Broker application submitted successfully. Your account is under verification by Super Admin.',
      status: 'PENDING',
      user: {
        id: result.user.id,
        email: result.user.email,
        phone: result.user.phone,
        companyName: result.user.companyName,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        isApproved: false,
      },
    };
  }

  static async login(identifier: string, password: string) {
    // Search user by email OR username OR phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone: identifier },
        ],
      },
      include: {
        brokerRequests: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Check approval status for Broker
    let isApproved = true;
    if (user.role === 'BROKER') {
      const reqStatus = user.brokerRequests?.status;
      if (reqStatus === 'PENDING' || !reqStatus) {
        isApproved = false;
      }
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        profileImage: user.profileImage,
        isApproved,
      },
      accessToken,
      refreshToken,
    };
  }

  static async registerSuperAdmin(email: string, password: string, firstName: string, lastName: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
    });

    return { id: user.id, email: user.email };
  }
}
