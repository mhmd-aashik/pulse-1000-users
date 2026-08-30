import { Module } from '@nestjs/common';

import { KeycloakAuthGuard } from './keycloak-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [KeycloakAuthGuard, RolesGuard],
  exports: [KeycloakAuthGuard, RolesGuard],
})
export class AuthModule {}
