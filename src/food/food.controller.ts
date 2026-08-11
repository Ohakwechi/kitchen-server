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
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './schemas/food.schema';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  // for seeding database
  @Post('bulk')
  async createBulk(@Body() createFoodDtos: CreateFoodDto[]): Promise<Food[]> {
    return this.foodService.insertMany(createFoodDtos);
  }

  @Post()
  async create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodService.create(createFoodDto);
  }

  @Get()
  async findAll(): Promise<Food[]> {
    return this.foodService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Food> {
    const food = await this.foodService.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return food;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ): Promise<Food> {
    const updatedFood = await this.foodService.update(id, updateFoodDto);
    if (!updatedFood) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return updatedFood;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.foodService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
  }
}