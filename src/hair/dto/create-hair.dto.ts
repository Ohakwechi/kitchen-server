export class CreateHairDto {
  name!: string;
  category!: string;
  price!: number;
  description!: string;
  imageUrl?: string;
  isAvailable?: boolean;
  durationMins?: number;
  targetGender!: string;
}