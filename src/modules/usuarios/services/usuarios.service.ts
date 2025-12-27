import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
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

    const usuario = this.usuariosRepository.create(crearUsuarioDto);
    return await this.usuariosRepository.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return await this.usuariosRepository.find();
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
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
