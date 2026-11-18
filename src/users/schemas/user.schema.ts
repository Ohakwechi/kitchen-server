import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true })
  phone!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true, default: 'Igando, Lagos' })
  location!: string;

  @Prop({ required: true, select: false })
  pinHash!: string;

  @Prop({ default: 0, min: 0 })
  paateeBalance!: number;

  @Prop({ default: 'resident', enum: ['resident', 'vendor', 'admin'] })
  role!: string;

  @Prop({ unique: true, sparse: true })
  magicLoginToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);