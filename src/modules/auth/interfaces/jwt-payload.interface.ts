import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: number;
  usuario: string;
  rol: UserRole;
}

export interface RequestUser {
  userId: number;
  usuario: string;
  rol: UserRole;
}
