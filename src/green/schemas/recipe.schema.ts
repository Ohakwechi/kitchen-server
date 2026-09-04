// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// @Schema()
// export className RecipeItem {
//   @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
//   ingredientId: Types.ObjectId;

//   @Prop({ required: true })
//   quantityRequired: number; // e.g., 0.25 (250g)
// }

// @Schema({ timestamps: true })
// export className Recipe extends Document {
//   @Prop({ type: Types.ObjectId, ref: 'FoodItem', required: true, unique: true })
//   foodItemId: Types.ObjectId; // Links to your existing Food Menu Item

//   @Prop({ type: [RecipeItem], required: true })
//   ingredients: RecipeItem[];
// }

// export const RecipeSchema = SchemaFactory.createForClass(Recipe);