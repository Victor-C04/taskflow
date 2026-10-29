
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import type { AuthenticatedRequest } from '../types/authenticated-request.js';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token required');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          algorithms: ['HS256']
        }
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return true;
  }

  private extractToken(request: Request): string | undefined {

    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
