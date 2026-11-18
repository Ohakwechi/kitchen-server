import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requesterId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  requesterName!: string;

  @Prop({ required: true, trim: true })
  requesterPhone!: string;

  @Prop({ required: true, trim: true })
  vendorId!: string;

  @Prop({ required: true, trim: true })
  vendorName!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({
    type: [{ name: String, quantity: Number, unitPrice: Number }],
    required: true,
  })
  items!: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];

  @Prop({ required: true, min: 1 })
  totalAmount!: number;

  @Prop({ required: true, trim: true })
  deliveryLocation!: string;

  @Prop({
    default: 'PENDING_PAYMENT',
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'ACCEPTED_BY_VENDOR',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'EXPIRED',
      'CANCELLED',
    ],
  })
  status!: string;

  @Prop({ enum: ['PAATEE_WALLET', 'OPAY_TRANSFER'] })
  paymentMethod?: string;

  @Prop({ unique: true, sparse: true })
  paymentReference?: string;

  @Prop({ trim: true })
  payerName?: string;

  @Prop({ trim: true })
  payerPhone?: string;

  @Prop({ lowercase: true, trim: true })
  payerEmail?: string;

  @Prop()
  paidAt?: Date;

  @Prop({ required: true })
  expiresAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);