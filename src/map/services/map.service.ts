import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MapPostEntity } from '../models/post.entity';
import { MapPost } from '../models/post.interface';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(MapPostEntity)
    private readonly MapPostRepository: Repository<MapPostEntity>,
  ) {}

  createPost(MapPost: MapPost): Observable<MapPost> {
    return from(this.MapPostRepository.save(MapPost));
  }
  findAllPosts(): Observable<MapPost[]> {
    return from(this.MapPostRepository.find());
  }
}
