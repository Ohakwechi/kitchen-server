import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GreenDocument = HydratedDocument<Green>;

@Schema({ timestamps: true })
export class Green {
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

export const GreenSchema = SchemaFactory.createForClass(Green);