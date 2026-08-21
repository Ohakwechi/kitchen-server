import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaundryController } from './laundry.controller';
import { LaundryService } from './laundry.service';
import { Laundry, LaundrySchema } from './schemas/laundry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Laundry.name, schema: LaundrySchema }]),
  ],
  controllers: [LaundryController],
  providers: [LaundryService],
})
export class LaundryModule {}