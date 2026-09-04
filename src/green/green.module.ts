import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GreenController } from './green.controller';
import { GreenService } from './green.service';
import { Green, GreenSchema } from './schemas/green.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Green.name, schema: GreenSchema }]),
  ],
  controllers: [GreenController],
  providers: [GreenService],
})
export class GreenModule {}
