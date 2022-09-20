import { Module } from '@nestjs/common';
import { MapService } from './services/map.service';
import { MapController } from './controllers/map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapPostEntity } from './models/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MapPostEntity])],
  providers: [MapService],
  controllers: [MapController],
})
export class MapModule {}
