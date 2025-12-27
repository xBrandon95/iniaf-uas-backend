import { RolUsuario } from '../../usuarios/entities/usuario.entity';

export interface JwtPayload {
  sub: number;
  usuario: string;
  rol: RolUsuario;
}

export interface UsuarioRequest {
  userId: number;
  usuario: string;
  rol: RolUsuario;
}
