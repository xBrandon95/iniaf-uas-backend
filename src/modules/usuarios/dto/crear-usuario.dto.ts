import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @MinLength(4, { message: 'El usuario debe tener al menos 4 caracteres' })
  @MaxLength(50)
  usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsEnum(RolUsuario, {
    message: 'El rol debe ser: admin, operador o supervisor',
  })
  @IsOptional()
  rol?: RolUsuario;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
