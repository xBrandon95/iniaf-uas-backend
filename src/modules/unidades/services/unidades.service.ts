import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from '../entities/unidad.entity';
import { CrearUnidadDto } from '../dto/crear-unidad.dto';
import { ActualizarUnidadDto } from '../dto/actualizar-unidad.dto';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private unidadesRepository: Repository<Unidad>,
  ) {}

  async crear(crearUnidadDto: CrearUnidadDto): Promise<Unidad> {
    const unidadExistente = await this.unidadesRepository.findOne({
      where: { nombre: crearUnidadDto.nombre },
    });

    if (unidadExistente) {
      throw new ConflictException('Ya existe una unidad con ese nombre');
    }

    const unidad = this.unidadesRepository.create(crearUnidadDto);
    return await this.unidadesRepository.save(unidad);
  }

  async obtenerTodas(): Promise<Unidad[]> {
    return await this.unidadesRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerActivas(): Promise<Unidad[]> {
    return await this.unidadesRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async obtenerPorId(id: number): Promise<Unidad> {
    const unidad = await this.unidadesRepository.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    return unidad;
  }

  async actualizar(
    id: number,
    actualizarUnidadDto: ActualizarUnidadDto,
  ): Promise<Unidad> {
    const unidad = await this.obtenerPorId(id);

    if (
      actualizarUnidadDto.nombre &&
      actualizarUnidadDto.nombre !== unidad.nombre
    ) {
      const unidadExistente = await this.unidadesRepository.findOne({
        where: { nombre: actualizarUnidadDto.nombre },
      });

      if (unidadExistente) {
        throw new ConflictException('Ya existe una unidad con ese nombre');
      }
    }

    Object.assign(unidad, actualizarUnidadDto);
    return await this.unidadesRepository.save(unidad);
  }

  async eliminar(id: number): Promise<void> {
    const unidad = await this.unidadesRepository.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    if (unidad.usuarios && unidad.usuarios.length > 0) {
      throw new ConflictException(
        `No se puede eliminar la unidad porque tiene ${unidad.usuarios.length} usuario(s) asignado(s)`,
      );
    }

    await this.unidadesRepository.remove(unidad);
  }

  async cambiarEstado(id: number): Promise<Unidad> {
    const unidad = await this.unidadesRepository.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    unidad.activo = !unidad.activo;
    return await this.unidadesRepository.save(unidad);
  }
}
