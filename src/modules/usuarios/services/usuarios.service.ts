import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../entities/usuario.entity';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { usuario: crearUsuarioDto.usuario },
    });

    if (usuarioExistente) {
      throw new ConflictException('El usuario ya existe');
    }

    // Validar que si no es admin, debe tener unidadId
    if (crearUsuarioDto.rol !== RolUsuario.ADMIN && !crearUsuarioDto.unidadId) {
      throw new BadRequestException(
        'Los usuarios con rol operador o supervisor deben tener una unidad asignada',
      );
    }

    // Si es admin, asegurar que unidadId sea null
    if (crearUsuarioDto.rol === RolUsuario.ADMIN) {
      crearUsuarioDto.unidadId = undefined;
    }

    const usuario = this.usuariosRepository.create(crearUsuarioDto);
    return await this.usuariosRepository.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return await this.usuariosRepository.find({
      relations: ['unidad'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerPorUnidad(unidadId: number): Promise<Usuario[]> {
    return await this.usuariosRepository.find({
      where: { unidadId },
      relations: ['unidad'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['unidad'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async obtenerPorNombreUsuario(
    nombreUsuario: string,
  ): Promise<Usuario | null> {
    return await this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.unidad', 'unidad')
      .where('usuario.usuario = :nombreUsuario', { nombreUsuario })
      .addSelect('usuario.password')
      .getOne();
  }

  async actualizar(
    id: number,
    actualizarUsuarioDto: ActualizarUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.obtenerPorId(id);

    if (
      actualizarUsuarioDto.usuario &&
      actualizarUsuarioDto.usuario !== usuario.usuario
    ) {
      const usuarioExistente = await this.usuariosRepository.findOne({
        where: { usuario: actualizarUsuarioDto.usuario },
      });

      if (usuarioExistente) {
        throw new ConflictException('El usuario ya existe');
      }
    }

    // Validar unidadId según el rol
    if (actualizarUsuarioDto.rol) {
      if (actualizarUsuarioDto.rol === RolUsuario.ADMIN) {
        actualizarUsuarioDto.unidadId = undefined;
      } else if (!actualizarUsuarioDto.unidadId && !usuario.unidadId) {
        throw new BadRequestException(
          'Los usuarios con rol operador o supervisor deben tener una unidad asignada',
        );
      }
    }

    Object.assign(usuario, actualizarUsuarioDto);
    return await this.usuariosRepository.save(usuario);
  }

  async eliminar(id: number): Promise<void> {
    const usuario = await this.obtenerPorId(id);
    await this.usuariosRepository.remove(usuario);
  }

  async cambiarEstado(id: number): Promise<Usuario> {
    const usuario = await this.obtenerPorId(id);
    usuario.activo = !usuario.activo;
    return await this.usuariosRepository.save(usuario);
  }
}
