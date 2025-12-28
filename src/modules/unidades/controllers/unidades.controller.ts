import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UnidadesService } from '../services/unidades.service';
import { CrearUnidadDto } from '../dto/crear-unidad.dto';
import { ActualizarUnidadDto } from '../dto/actualizar-unidad.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';

@Controller('unidades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  @Roles(RolUsuario.ADMIN)
  crear(@Body() crearUnidadDto: CrearUnidadDto) {
    return this.unidadesService.crear(crearUnidadDto);
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.SUPERVISOR)
  obtenerTodas() {
    return this.unidadesService.obtenerTodas();
  }

  @Get('activas')
  @Roles(RolUsuario.ADMIN, RolUsuario.SUPERVISOR, RolUsuario.OPERADOR)
  obtenerActivas() {
    return this.unidadesService.obtenerActivas();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.SUPERVISOR)
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.obtenerPorId(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarUnidadDto: ActualizarUnidadDto,
  ) {
    return this.unidadesService.actualizar(id, actualizarUnidadDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.eliminar(id);
  }

  @Patch(':id/cambiar-estado')
  @Roles(RolUsuario.ADMIN)
  cambiarEstado(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.cambiarEstado(id);
  }
}
