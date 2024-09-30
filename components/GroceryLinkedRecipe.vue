<script lang="ts" setup>
import { Types } from 'mongoose';
import { IRecipe } from '~/types';

const emit = defineEmits(["maximize-recipe", "delete-grocery-items"]);
defineProps<{
  fetchedRecipes: IRecipe[];
}>();

const maximizeRecipe = (recipe: IRecipe) => {
  emit('maximize-recipe', recipe)
}

const deleteGroceryItemsByRecipeId = (recipeId: Types.ObjectId) => {
  emit('delete-grocery-items', recipeId)
}
</script>

<template>
  <div class="mt-24 md:mt-0 lg:mt-0">
    <div class="px-4 space-y-2 mt-2" v-if="!fetchedRecipes.length">
      <h2 class="font-semibold text-2xl font-source">Recipes</h2>
      <p class="italic text-xl font-laura">When you add ingredients from a recipe, the recipe will show up here.</p>
    </div>
    <div class="p-4" v-else>
      <h2 class="font-medium text-xl">Recipes</h2>
      <ul class="py-4">
        <li v-for="recipe in fetchedRecipes" :key="recipe._id?.toString()" class="flex justify-between items-center">
          <a class="text-base cursor-pointer" @click="maximizeRecipe(recipe)">{{ recipe.title }}</a>
          <button 
          @click="deleteGroceryItemsByRecipeId(recipe._id!)"
          class="btn btn-md btn-circle bg-transparent border-0 hover:bg-transparent hover:border-0"
          >
            <i class="ri i-ri-close-line text-2xl text-gray-400"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
