import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LaundryDocument = HydratedDocument<Laundry>;

@Schema({ timestamps: true })
export class Laundry {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: string; // e.g., 'Dry Cleaning', 'Wash & Fold', 'Ironing'

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ required: false })
  turnaroundTimeHours?: number; // e.g., 24

  @Prop({ required: true, default: 'per_item' })
  pricingType!: string; // e.g., 'per_item', 'per_kg', 'per_pair'
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);