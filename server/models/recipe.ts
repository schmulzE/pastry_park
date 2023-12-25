import { Schema, model } from "mongoose";

const RecipeSchema = new Schema(
    {
        title: String,
        description: String,
        steps: String,
        ingredients: String,
        video_url: String,
        image: String,
        url: String,
        cookingtime: Array,
        source: String,
        yield: String,
        category: String,
        rating: Number,
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export const Recipe = model("Recipe", RecipeSchema);
