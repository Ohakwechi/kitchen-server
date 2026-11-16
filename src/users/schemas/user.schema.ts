import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: 'Igando, Lagos', trim: true })
  location: string; // e.g. "Diamond Estate Gate 2, Isuti Rd"

  @Prop({ default: 0 })
  paateeBalance: number; // Stored in Naira as numeric value (e.g., 45250)

  @Prop({ default: 'resident', enum: ['resident', 'vendor', 'admin'] })
  role: string;

  @Prop({ unique: true, sparse: true })
  magicLoginToken?: string; // Used when Mjay receives her post-payment login link
}

export const UserSchema = SchemaFactory.createForClass(User);