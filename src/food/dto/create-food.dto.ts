export class CreateFoodDto {
  name!: string;
  category!: string;
  price!: number;
  description!: string;
  imageUrl?: string;
  isOutOfStock?: boolean;
  allergens?: string[];
  prepTimeMins?: number;
}