import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Item name is required' })
  name!: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;

  @IsNumber()
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice!: number;
}

export class CreateSharedOrderDto {
  @IsString()
  @IsNotEmpty()
  vendorId!: string;

  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Cart cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNumber()
  @Min(1)
  totalAmount!: number;

  @IsString()
  @IsNotEmpty()
  deliveryLocation!: string;
}

export class PaySharedOrderDto {
  @IsEnum(['PAATEE_WALLET', 'OPAY_TRANSFER'])
  paymentMethod!: 'PAATEE_WALLET' | 'OPAY_TRANSFER';

  @IsString()
  @IsNotEmpty({ message: 'Your name is required for the receipt' })
  payerName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Your WhatsApp number is required' })
  payerPhone!: string;

  @IsEmail({}, { message: 'Valid email is required' })
  @IsOptional()
  payerEmail?: string;

  @IsString()
  @IsOptional()
  transferReference?: string;
}