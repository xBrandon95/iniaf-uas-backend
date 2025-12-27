import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum RolUsuario {
  ADMIN = 'admin',
  OPERADOR = 'operador',
  SUPERVISOR = 'supervisor',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.OPERADOR,
  })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  // Método para encriptar la contraseña antes de insertar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Método para validar contraseña
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
