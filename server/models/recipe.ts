import { Schema, model } from "mongoose";

interface CookingTime{
	id: string,
	title: string,
	hour: number,
	minute: number,
}

export interface RecipeDocument extends Document {
  title: string,
	description: string,
	steps: string,
	ingredients: string,
	video_url: string,
	image: string,
	url: string,
	cookingtime: CookingTime[],
	source: string,
	yields: string,
	category: string,
	rating: number,
	createdBy: string,
	createdAt?: string,
}

const RecipeSchema = new Schema({
	title: String,
	description: String,
	steps: Array,
	ingredients: Array,
	video_url: String,
	image: String,
	url: String,
	cookingtime: Array,
	source: String,
	yields: String,
	category: {type: String, required: true},
	rating: Number,
	created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
},
{
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
}
);

	RecipeSchema.pre('save', function(next) {
		console.log('Saving recipe:', this);
		next();
	});

	RecipeSchema.post('save', function(error: any, doc: any, next: () => void) {
		if (error) {
			console.error('Error saving recipe:', error);
		} else {
			console.log('Recipe saved:', doc);
		}
		next();
	});

export const Recipe = model<RecipeDocument>("Recipe", RecipeSchema);
