import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HairDocument = HydratedDocument<Hair>;

@Schema({ timestamps: true })
export class Hair {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: string; // e.g., 'Barber', 'Braids', 'Styling', 'Nails'

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ required: false })
  durationMins?: number; // e.g., 45 (minutes)

  @Prop({ required: true, default: 'Unisex' })
  targetGender!: string; // e.g., 'Men', 'Women', 'Unisex', 'Kids'
}

export const HairSchema = SchemaFactory.createForClass(Hair);