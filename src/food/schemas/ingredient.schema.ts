// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema({ timestamps: true })
// export className Ingredient extends Document {
//   @Prop({ required: true })
//   name: string; // e.g., "Long Grain Rice"

//   @Prop({ required: true })
//   unit: string; // e.g., "kg", "liters", "pieces", "packs"

//   @Prop({ required: true, default: 0 })
//   currentStock: number; // e.g., 45.5

//   @Prop({ required: true, default: 5 })
//   reorderLevel: number; // Alert when stock drops below this

//   @Prop({ required: true, default: 0 })
//   unitCost: number; // Purchase price per unit for profit calculation
// }

// export const IngredientSchema = SchemaFactory.createForClass(Ingredient);