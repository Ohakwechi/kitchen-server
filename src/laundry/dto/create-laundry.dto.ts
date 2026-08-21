export class CreateLaundryDto {
  name!: string;
  category!: string;
  price!: number;
  description!: string;
  imageUrl?: string;
  isAvailable?: boolean;
  turnaroundTimeHours?: number;
  pricingType!: string;
}