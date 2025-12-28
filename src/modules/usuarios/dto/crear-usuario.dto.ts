import {
  IsString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateIf,
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

  @ValidateIf((o: CrearUsuarioDto) => o.rol !== RolUsuario.ADMIN)
  @IsNumber({}, { message: 'El ID de unidad debe ser un número' })
  @IsNotEmpty({
    message: 'El ID de unidad es obligatorio para roles que no sean admin',
  })
  unidadId?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
