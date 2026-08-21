import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LaundryService } from './laundry.service';
import { CreateLaundryDto } from './dto/create-laundry.dto';
import { UpdateLaundryDto } from './dto/update-laundry.dto';
import { Laundry } from './schemas/laundry.schema';

@Controller('laundry')
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @Post('bulk')
  async createBulk(@Body() createLaundryDtos: CreateLaundryDto[]): Promise<Laundry[]> {
    return this.laundryService.insertMany(createLaundryDtos);
  }

  @Post()
  async create(@Body() createLaundryDto: CreateLaundryDto): Promise<Laundry> {
    return this.laundryService.create(createLaundryDto);
  }

  @Get()
  async findAll(): Promise<Laundry[]> {
    return this.laundryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Laundry> {
    const laundry = await this.laundryService.findOne(id);
    if (!laundry) {
      throw new NotFoundException(`Laundry item with ID ${id} not found`);
    }
    return laundry;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLaundryDto: UpdateLaundryDto,
  ): Promise<Laundry> {
    const updated = await this.laundryService.update(id, updateLaundryDto);
    if (!updated) {
      throw new NotFoundException(`Laundry item with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.laundryService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Laundry item with ID ${id} not found`);
    }
  }
}