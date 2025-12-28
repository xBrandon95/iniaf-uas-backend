import { PartialType } from '@nestjs/mapped-types';
import { CrearUnidadDto } from './crear-unidad.dto';

export class ActualizarUnidadDto extends PartialType(CrearUnidadDto) {}
