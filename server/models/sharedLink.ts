import { nanoid } from 'nanoid';
import mongoose, { Schema, model } from "mongoose";

export interface SharedLinkDocument extends Document {
  _id?: string;
  url: string;
  recipeId: any;
  createdBy: any;
  createdAt?: string;
}

const SharedLinkSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
},
{
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
}
);

SharedLinkSchema.pre('save', function(next) {
		console.log('Saving recipe:', this);
		next();
	});

	SharedLinkSchema.post('save', function(error: any, doc: any, next: () => void) {
		if (error) {
			console.error('Error saving recipe:', error);
		} else {
			console.log('Recipe saved:', doc);
		}
		next();
	});

export const SharedLink = model<SharedLinkDocument>("SharedLink", SharedLinkSchema);