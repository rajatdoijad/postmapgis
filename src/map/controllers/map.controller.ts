import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, readFileSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Observable } from 'rxjs';
import { MapPost } from '../models/post.interface';
import { MapService } from '../services/map.service';
import { parse } from 'papaparse';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}
  // @Post('file')
  // @UseInterceptors(
  //   FileInterceptor('file_asset', {
  //     storage: diskStorage({
  //       destination: './files',
  //     }),
  //   }),
  // )
  // async uploadFile() {
  //   const csvFile = readFileSync('files/1.csv');
  //   //  console.log(csvFile,'csv file')
  //   const csvData = csvFile.toString();
  //   console.log(csvData, 'Csv data new');
  //   const parsedCsv = await parse(csvData, {
  //     header: false,
  //     skipEmptyLines: false,
  //     transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
  //     complete: (results) => results.data,
  //   });
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './mapbox',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          callback(null, `${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(new Error('Only CSV files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const csvFile = readFileSync('files/1.csv');
    const csvData = csvFile.toString();
    const parsedCsv = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    console.log(parsedCsv.data[0]);

    parsedCsv.data.forEach((element) => {
      const point = {
        type: 'Point',
        coordinates: [element.lati, element.long],
      };
      const loadData = {
        map_id: parsedCsv.data[0].map_id,
        map_lat: parsedCsv.data[0].map_lat,
        map_lon: parsedCsv.data[0].map_lon,
        map_name: parsedCsv.data[0].map_name,
        map_cityname: parsedCsv.data[0].map_cityname,
        location: point,
        // location:'0101000020E61000007A8D5DA27A1333403FAA61BF27385240',
      };
      console.log(loadData);
      this.mapService.create(loadData);
      const response = {
        message: 'File uploaded successfully!',
        data: {
          originalname: file.originalname,
          // filename: file.filename,
        },
      };
      return response;
    });
  }
}
//   // @Post()
// create(@Body() post: MapPost): Observable<MapPost> {
//   return this.MapService.createPost(post);
// }
// @Get()
// findAll(): Observable<MapPost[]> {
//   return this.MapService.findAllPosts();
// }
