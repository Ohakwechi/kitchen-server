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
import { HairService } from './hair.service';
import { CreateHairDto } from './dto/create-hair.dto';
import { UpdateHairDto } from './dto/update-hair.dto';
import { Hair } from './schemas/hair.schema';

@Controller('hair')
export class HairController {
  constructor(private readonly hairService: HairService) {}

  @Post('bulk')
  async createBulk(@Body() createHairDtos: CreateHairDto[]): Promise<Hair[]> {
    return this.hairService.insertMany(createHairDtos);
  }

  @Post()
  async create(@Body() createHairDto: CreateHairDto): Promise<Hair> {
    return this.hairService.create(createHairDto);
  }

  @Get()
  async findAll(): Promise<Hair[]> {
    return this.hairService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hair> {
    const hair = await this.hairService.findOne(id);
    if (!hair) {
      throw new NotFoundException(`Hair style item with ID ${id} not found`);
    }
    return hair;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHairDto: UpdateHairDto,
  ): Promise<Hair> {
    const updated = await this.hairService.update(id, updateHairDto);
    if (!updated) {
      throw new NotFoundException(`Hair style item with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.hairService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Hair style item with ID ${id} not found`);
    }
  }
}