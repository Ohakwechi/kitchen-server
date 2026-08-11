import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FoodDocument = HydratedDocument<Food>;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ default: false })
  isOutOfStock!: boolean;

  @Prop({ type: [String], default: [] })
  allergens!: string[];

  @Prop({ required: false })
  prepTimeMins?: number;
}

export const FoodSchema = SchemaFactory.createForClass(Food);