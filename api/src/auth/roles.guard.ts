import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ROLES_KEY } from './roles.decorator';
import type { KeycloakUser } from './types/keycloak-user';

type AuthenticatedRequest = Request & {
  user?: KeycloakUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const userRoles = request.user?.roles ?? [];

    const allowed = requiredRoles.some((role) => userRoles.includes(role));

    if (!allowed) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
