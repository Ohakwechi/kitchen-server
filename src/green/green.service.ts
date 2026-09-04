import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Green, GreenDocument } from './schemas/green.schema';
import { CreateGreenDto } from './dto/create-green.dto';
import { UpdateGreenDto } from './dto/update-green.dto';

@Injectable()
export class GreenService {
  constructor(
    @InjectModel(Green.name) private readonly greenModel: Model<GreenDocument>,
  ) {}

  async findAll(): Promise<Green[]> {
    return this.greenModel.find().exec();
  }

  async findOne(id: string): Promise<Green | null> {
    return this.greenModel.findById(id).exec();
  }

  async create(createGreenDto: CreateGreenDto): Promise<Green> {
    const newGreen = new this.greenModel(createGreenDto);
    return newGreen.save();
  }

  async update(id: string, updateGreenDto: UpdateGreenDto): Promise<Green | null> {
    return this.greenModel
      .findByIdAndUpdate(id, updateGreenDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.greenModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // for seeding database
  async insertMany(createGreenDtos: CreateGreenDto[]): Promise<Green[]> {
    const docs = await this.greenModel.insertMany(createGreenDtos);
    return docs as unknown as Green[];
  }
}
