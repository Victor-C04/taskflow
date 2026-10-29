
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  create(name: string, email: string, passwordHash: string) {
    return this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'MEMBER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
}
