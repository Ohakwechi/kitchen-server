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
import { GreenService } from './green.service';
import { CreateGreenDto } from './dto/create-green.dto';
import { UpdateGreenDto } from './dto/update-green.dto';
import { Green } from './schemas/green.schema';

@Controller('green')
export class GreenController {
  constructor(private readonly greenService: GreenService) {}

  // for seeding database
  @Post('bulk')
  async createBulk(@Body() createGreenDtos: CreateGreenDto[]): Promise<Green[]> {
    return this.greenService.insertMany(createGreenDtos);
  }

  @Post()
  async create(@Body() createGreenDto: CreateGreenDto): Promise<Green> {
    return this.greenService.create(createGreenDto);
  }

  @Get()
  async findAll(): Promise<Green[]> {
    return this.greenService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Green> {
    const green = await this.greenService.findOne(id);
    if (!green) {
      throw new NotFoundException(`Green item with ID ${id} not found`);
    }
    return green;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGreenDto: UpdateGreenDto,
  ): Promise<Green> {
    const updatedGreen = await this.greenService.update(id, updateGreenDto);
    if (!updatedGreen) {
      throw new NotFoundException(`Green item with ID ${id} not found`);
    }
    return updatedGreen;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.greenService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
  }
}
