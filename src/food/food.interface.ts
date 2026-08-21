export class Food {
  id!: number;
  name!: string;
  category!: string;
  price!: number;
  description!: string;
  imageUrl?: string;
  isOutOfStock!: boolean;
  allergens!: string[];
  prepTimeMins?: number;
}