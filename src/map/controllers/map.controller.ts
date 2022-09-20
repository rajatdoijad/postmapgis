import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Observable } from 'rxjs';
import { MapPost } from '../models/post.interface';
import { MapService } from '../services/map.service';
import { parse } from 'papaparse';

@Controller('map')
export class MapController {
  constructor(private MapService: MapService) {}
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file_asset', {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  async uploadFile() {
    const csvFile = readFileSync('files/1.csv');
    //  console.log(csvFile,'csv file')
    const csvData = csvFile.toString();
    console.log(csvData, 'Csv data new');
    const parsedCsv = await parse(csvData, {
      header: false,
      skipEmptyLines: false,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    // @Post()
    // create(@Body() post: MapPost): Observable<MapPost> {
    //   return this.MapService.createPost(post);
    // }
    // @Get()
    // findAll(): Observable<MapPost[]> {
    //   return this.MapService.findAllPosts();
    // }
  }
}
