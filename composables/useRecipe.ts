import { defineStore } from "pinia";
import { IRecipe } from "~~/types";

export const useRecipeStore = defineStore("recipe-store", {
	state: () => ({
		recipes: [] as IRecipe[],
		singleRecipe: {} as IRecipe,
		error: null
	}),
	actions: {
		// Get all recipe from DB
		async getAll() {
			try {
				let data = await $fetch<IRecipe[]>("/recipe");
				this.recipes = data;
				this.singleRecipe = this.recipes[this.recipes.length - 1];
				return data as IRecipe[];
			} catch (e: any) {
				this.error = e.message
			}
		},
		// Create a new recipe
		async create(data: IRecipe) {
			await $fetch("/recipe/create", {
				method: "POST",
				body: data ,
			})
				.catch((e) => {
					this.error = e.data.message;
				})
				.then(async () => {
					await this.getAll();
				});
		},
		// Update a recipe
		async update(id: string, data: IRecipe) {
			await $fetch(`/recipe/${id}`, {
				method: "PUT",
				body: data ,
			})
				.catch((e) => {
					this.error = e.data.message;
				})
				.then(async () => {
					await this.getAll();
				});
		},
		// delete a recipe
		async remove(id: string) {
			await $fetch(`/recipe/${id}`, {
				method: "DELETE",
			})
				.catch((e) => {
					this.error = e.data.message;
				})
				.then(async () => {
					await this.getAll();
				});
		},
		//fetch recipe by category
		async fetchById(id: string) {
			try {
				let data = await $fetch<IRecipe>(`/recipe/${id}`);
				this.singleRecipe = data;
				return data as IRecipe;
			} catch (e: any) {
				this.error = e.message
			}
		},
	},
});