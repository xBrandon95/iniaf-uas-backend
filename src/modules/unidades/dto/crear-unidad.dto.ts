import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CrearUnidadDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @MaxLength(255, { message: 'La ubicación no puede exceder 255 caracteres' })
  ubicacion: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
