<script lang="ts" setup>
import { IRecipe } from '~/types';
defineProps<{
  recipe: IRecipe;
  isEditable: boolean
}>()
</script>

<template>
  <RecipeEditor :payload="recipe.steps" :isEditable="isEditable"/>
</template>
