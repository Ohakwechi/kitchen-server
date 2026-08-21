import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Laundry, LaundryDocument } from './schemas/laundry.schema';
import { CreateLaundryDto } from './dto/create-laundry.dto';
import { UpdateLaundryDto } from './dto/update-laundry.dto';

@Injectable()
export class LaundryService {
  constructor(
    @InjectModel(Laundry.name) private readonly laundryModel: Model<LaundryDocument>,
  ) {}

  async findAll(): Promise<Laundry[]> {
    return this.laundryModel.find().exec();
  }

  async findOne(id: string): Promise<Laundry | null> {
    return this.laundryModel.findById(id).exec();
  }

  async create(createLaundryDto: CreateLaundryDto): Promise<Laundry> {
    const newLaundry = new this.laundryModel(createLaundryDto);
    return newLaundry.save();
  }

  async insertMany(createLaundryDtos: CreateLaundryDto[]): Promise<Laundry[]> {
    const docs = await this.laundryModel.insertMany(createLaundryDtos);
    return docs as unknown as Laundry[];
  }

  async update(id: string, updateLaundryDto: UpdateLaundryDto): Promise<Laundry | null> {
    return this.laundryModel
      .findByIdAndUpdate(id, updateLaundryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.laundryModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}