<script lang="ts" setup>
import { IRecipe, IRecipeIngredient } from '~/types';

defineProps<{
  recipe: IRecipe;
  recipeIngredients?: IRecipeIngredient[];
  handleIngredient? :any;
  isEditable: boolean
}>()
</script>

<template>
  <RecipeEditor :payload="recipe.ingredients" :isEditable="isEditable"/>
</template>
