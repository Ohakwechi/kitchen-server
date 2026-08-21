import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HairController } from './hair.controller';
import { HairService } from './hair.service';
import { Hair, HairSchema } from './schemas/hair.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hair.name, schema: HairSchema }]),
  ],
  controllers: [HairController],
  providers: [HairService],
})
export class HairModule {}