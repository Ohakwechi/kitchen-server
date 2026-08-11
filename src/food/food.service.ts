import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>,
  ) {}

  async findAll(): Promise<Food[]> {
    return this.foodModel.find().exec();
  }

  async findOne(id: string): Promise<Food | null> {
    return this.foodModel.findById(id).exec();
  }

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const newFood = new this.foodModel(createFoodDto);
    return newFood.save();
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food | null> {
    return this.foodModel
      .findByIdAndUpdate(id, updateFoodDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.foodModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // for seeding database
  async insertMany(createFoodDtos: CreateFoodDto[]): Promise<Food[]> {
    const docs = await this.foodModel.insertMany(createFoodDtos);
    return docs as unknown as Food[];
  }

}
