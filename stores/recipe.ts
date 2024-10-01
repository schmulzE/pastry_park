import { defineStore } from "pinia";
import { IRecipe } from "~~/types";

export const useRecipeStore = defineStore("recipe", {
	state: () => ({
		recipes: [] as IRecipe[],
		singleRecipe: {} as IRecipe,
		error: null
	}),
	actions: {
		// Get all recipe from DB
		async getAll() {
			try {
				let data = await $fetch<IRecipe[]>("/recipe", { method: "GET"});
				this.recipes = data;
				// this.singleRecipe = this.recipes[this.recipes.length - 1];
				return data as IRecipe[];
			} catch (e: any) {
				this.error = e.message
			}
		},
		
		// Create a new recipe
		async create(data: IRecipe) {
			try {
				const res = await	$fetch<IRecipe>("/recipe", {	method: "POST", body: data })
				this.singleRecipe = (res as any).recipe;
			} catch (e: any) {
				this.error = e.data.message;
			}
		},
		// Update a recipe
		async update(id: string, data: IRecipe) {
			try{
				const res = await $fetch(`/recipe/${id}`, {method: "PUT", body: data})
				this.singleRecipe = (res as any).recipe;
			}catch(e: any){
				this.error = e.data.message
			}
		
		},
		// delete a recipe
		async remove(id: string) {
			try{
				await $fetch(`/recipe/${id}`, { method: "DELETE"})
			}catch(e: any) {
				this.error = e.data.message;
			}
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