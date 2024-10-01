<script lang="ts" setup>
import { Types } from 'mongoose';
import { IRecipe } from '~/types';

defineProps<{
  recipe: IRecipe
}>();

const emit = defineEmits(['display-recipe'])

const getRecipeId = (id: Types.ObjectId) => {
  emit('display-recipe', id)
}
</script>

<template>
  <li class="text-center mt-4 md:mt-0 lg-0" @click="getRecipeId(recipe._id!)" :key="recipe._id?.toString()">
    <div 
    v-if="recipe.image" 
    class=" w-auto mx-4 bg-contain bg-center bg-no-repeat bg-gray-200 h-24 my-2" 
    :style="`background-image: url(${recipe.image}); min-height: 200px;`"
     />
    <h1 class="text-xl uppercase font-bold my-2"> {{ recipe.title }}</h1>
    <div>
      <a v-if="recipe" class="inline-flex flex-row-reverse space-x-1"  v-for="(star, index) in 5" :key="index">
        <span class="i-ri-star-fill w-4 h-4 text-gray-300 cursor-default" :class="{
          'text-gray-300': index >= recipe.rating!,
          'text-yellow-500': index < recipe.rating!,
        }"></span>
      </a>
    </div>
  </li>
</template>
