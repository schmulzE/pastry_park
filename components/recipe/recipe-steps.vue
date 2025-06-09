<script lang="ts" setup>
import { IRecipe } from '~/types';
import RecipeEditor from './recipe-rich-text-editor.vue';

defineProps<{
  recipe: IRecipe;
  isEditable: boolean
}>();

</script>

<template>
  <RecipeEditor :payload="recipe.steps" :isEditable="isEditable"/>
</template>
