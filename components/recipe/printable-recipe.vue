<template>
  <div class="printable-recipe">
    <h1 class="recipe-title">{{ recipe.title }}</h1>
    <hr />
    <p class="recipe-description">{{ recipe.description }}</p>
    <div v-if="recipe.image" class="recipe-image" :style="{ backgroundImage: `url('${recipe.image}')` }"></div>
    <div class="recipe-meta">
      <div>
        <a :href="recipe.url" target="_blank" class="recipe-source">{{ recipe.source }}</a>
        <h2 v-if="recipe.yields" class="recipe-yields">Serves: {{ recipe.yields }}</h2>
      </div>
      <ul class="cooking-times">
        <li v-for="item in recipe.cookingtime" :key="item.title" class="cooking-time-item">
          <h1 class="cooking-time-title">{{ item.title }}</h1>
          <span v-if="item.hours">{{ item.hours }} hrs </span>
          <span v-if="item.minutes">{{ item.minutes }} mins</span>
        </li>
      </ul>
    </div>
    <div class="recipe-content">
      <ul class="ingredients-list">
        <li v-for="ingredient in recipeIngredients" :key="ingredient.id">
          <!-- <strong>{{ convertToFraction(ingredient.quantity!.replace(/\s+/g, '')) }} {{ ingredient?.unit }}</strong> -->
          <strong>{{ convertToFraction(ingredient.quantity) }} {{ ingredient?.unit }}</strong>
          {{ parseVulgars(ingredient.note) }}
        </li>
      </ul>
      <ul class="steps-list">
        <li v-for="(step, index) in recipe.steps" :key="index">{{ step }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseVulgars } from 'vulgar-fractions';
import { IRecipe, IRecipeIngredient } from '~/types';
import { convertToFraction } from '@/utils/fractionConverter';


defineProps<{
  recipe: IRecipe
  recipeIngredients: IRecipeIngredient[]
}>();

</script>
