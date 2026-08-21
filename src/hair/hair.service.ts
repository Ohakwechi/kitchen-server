import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hair, HairDocument } from './schemas/hair.schema';
import { CreateHairDto } from './dto/create-hair.dto';
import { UpdateHairDto } from './dto/update-hair.dto';

@Injectable()
export class HairService {
  constructor(
    @InjectModel(Hair.name) private readonly hairModel: Model<HairDocument>,
  ) {}

  async findAll(): Promise<Hair[]> {
    return this.hairModel.find().exec();
  }

  async findOne(id: string): Promise<Hair | null> {
    return this.hairModel.findById(id).exec();
  }

  async create(createHairDto: CreateHairDto): Promise<Hair> {
    const newStyle = new this.hairModel(createHairDto);
    return newStyle.save();
  }

  async insertMany(createHairDtos: CreateHairDto[]): Promise<Hair[]> {
    const docs = await this.hairModel.insertMany(createHairDtos);
    return docs as unknown as Hair[];
  }

  async update(id: string, updateHairDto: UpdateHairDto): Promise<Hair | null> {
    return this.hairModel
      .findByIdAndUpdate(id, updateHairDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.hairModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}