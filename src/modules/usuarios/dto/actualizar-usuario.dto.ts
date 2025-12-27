import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './crear-usuario.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
