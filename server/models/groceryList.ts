import { Schema, Types, model } from "mongoose";

// Type for GroceryItem
export interface GroceryItem {
  _id: string;
  note: string;
  quantity: string;
  unit: string;
  group: string;
  completed: boolean;
  recipeId: Types.ObjectId | null;
  keyword: string;
}

export interface GroceryListDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: GroceryItem[];
}

const GroceryItemSchema = new Schema({
  note: { type: String },
  quantity: { type: String },
  unit: String,
  group: { type: String, default: 'uncategorized' },
  completed: { type: Boolean, default: false },
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
  keyword: { type: String }
});

const GroceryListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [GroceryItemSchema]
});


GroceryListSchema.pre('save', function(next) {
		console.log('Saving recipe:', this);
		next();
	});

	GroceryListSchema.post('save', function(error: any, doc: any, next: () => void) {
		if (error) {
			console.error('Error saving recipe:', error);
		} else {
			console.log('Recipe saved:', doc);
		}
		next();
	});

export const GroceryList = model<GroceryListDocument>("GroceryList", GroceryListSchema);
