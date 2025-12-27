import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioRequest } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsuarioRequest => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UsuarioRequest;

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado en la solicitud');
    }

    return user;
  },
);
