import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

import type { KeycloakUser } from './types/keycloak-user';

type KeycloakPayload = JWTPayload & {
  preferred_username?: string;
  email?: string;

  realm_access?: {
    roles?: string[];
  };
};

type AuthenticatedRequest = Request & {
  user?: KeycloakUser;
};

const keycloakUrl = process.env.KEYCLOAK_URL;
const keycloakRealm = process.env.KEYCLOAK_REALM;

if (!keycloakUrl || !keycloakRealm) {
  throw new Error('KEYCLOAK_URL and KEYCLOAK_REALM are required');
}

const issuer = `${keycloakUrl}/realms/${keycloakRealm}`;

const JWKS = createRemoteJWKSet(
  new URL(`${issuer}/protocol/openid-connect/certs`),
);

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer,
        algorithms: ['RS256'],
      });

      const keycloakPayload = payload as KeycloakPayload;

      request.user = {
        userId: keycloakPayload.sub ?? '',
        username: keycloakPayload.preferred_username,
        email: keycloakPayload.email,
        roles: keycloakPayload.realm_access?.roles ?? [],
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractBearerToken(request: Request): string | null {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return null;
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
