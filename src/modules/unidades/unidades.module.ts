import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesService } from './services/unidades.service';
import { UnidadesController } from './controllers/unidades.controller';
import { Unidad } from './entities/unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad])],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}
