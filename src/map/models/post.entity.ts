/* eslint-disable prettier/prettier */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity('map_new')
export class MapPostEntity {
  @PrimaryGeneratedColumn()
  map_id: number;

  @Column()
  map_lat: string;
  @Column()
  map_lon: string;
  @Column()
  map_name: string;
  @Column()
  map_cityname: string;
  
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

}
