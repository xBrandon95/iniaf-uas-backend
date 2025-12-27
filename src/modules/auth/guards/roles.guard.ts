import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsuarioRequest } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: UsuarioRequest } = context
      .switchToHttp()
      .getRequest();

    const tienePermiso = requiredRoles.some((role) => user.rol === role);

    if (!tienePermiso) {
      const rolesRequeridos = requiredRoles.join(', ');
      throw new ForbiddenException(
        `No tienes permisos suficientes. Se requiere uno de los siguientes roles: ${rolesRequeridos}. Tu rol actual es: ${user.rol}`,
      );
    }

    return true;
  }
}
