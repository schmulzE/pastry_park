<script lang="ts" setup>
import { parseVulgars } from 'vulgar-fractions';
import StarRating from '../ui/star-rating.vue';
import { IRecipeIngredient, IRecipe } from '~/types';
import { convertToFraction } from '@/utils/fractionConverter';

const props = defineProps<{
  recipe: IRecipe,
  recipeIngredients: IRecipeIngredient[],
}>()

const showMore = ref(false);
let selectedIngredients = ref<any[]>([])

const handleRating = async(value: number) => {
  try{
    await $fetch(`/recipe/${props.recipe!._id}`, {method: "PUT", body: {rating: value}})
  }catch(e){
    console.log(e)
  }
}

const toggleIngredient = (ingredient: { id: string; }) => {
  const index = selectedIngredients.value.findIndex(
    (item) => item.id === ingredient.id
  );
  if (index === -1) {
    selectedIngredients.value.push(ingredient);
  } else {
    selectedIngredients.value.splice(index, 1);
  }
};

const isSelected = (ingredient: { id: string; }) => {
  return selectedIngredients.value.some((item) => item.id === ingredient.id);
}


const toggleShowMore = () => {
  showMore.value = !showMore.value
};

</script>
<template>
  <div class="px-8 py-32 md:px-4 md:py-16 lg:px-8 lg:py-16">
    <h1 v-if="recipe?.title" class="text-3xl lg:text-5xl uppercase font-lora font-medium my-2"> {{ recipe?.title }} </h1>
    <hr v-if="recipe?.title" class="bg-gray-500 lg:bg-gray-900"/>
    <p class="text-3xl italic my-2 line-clamp-3 font-lora italics" :class="{ 'line-clamp-none': showMore }"> {{ recipe?.description }}</p>
    <button v-if="recipe?.description.trim().length >= 200" @click="toggleShowMore" class="block text-xl text-gray-400 italic">{{ showMore ? 'less' : 'more' }}</button>
    <StarRating v-if="recipe?._id" @rating="handleRating" :currentRating="recipe?.rating"/>

    <div v-if="recipe?.image" class="w-full bg-center lg:bg-cover bg-no-repeat bg-gray-200 h-48 lg:h-96 my-2" :style="{ backgroundImage: `url('${recipe.image}')`, minHeight: '200px' }"/>
    <div class="my-4 flex justify-between font-mulish">
      <div>
        <a :href="recipe?.url" target="_blank" class="capitalize text-base link font-semibold">{{ recipe?.source }}</a>
        <h2 v-if="recipe?.yields" class="capitalize my-1 text-md"> serves: {{ recipe?.yields }}</h2>
      </div>

      <div>
        <ul class="flex gap-x-4 font-mulish">
          <li v-for="item in recipe?.cookingtime" :key="item.id">
            <h1 class="text-base font-medium uppercase">{{ item?.title }}</h1>
            <span v-if="item.hours" class="">{{ item.hours }} hrs </span>
            <span v-if="item.minutes" class="">{{ item.minutes }} mins</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="hidden md:flex md:justify-between lg:flex lg:justify-between lg:gap-x-6 font-mulish">
      <ul class="py-2 basis-2/5 space-y-4" >
        <li v-for="ingredient in recipeIngredients" :key="ingredient.id">
          <span @click="toggleIngredient(ingredient)" :class="{ 'selected': isSelected(ingredient!) }">
            <strong>{{ convertToFraction(ingredient.quantity) }} {{ ingredient.unit }}</strong> {{ parseVulgars(ingredient.note) }}
          </span>
        </li>
      </ul>
      <ol class="basis-3/5 py-2 space-y-4">
        <li v-for="step in recipe?.steps">{{ step }}</li>
      </ol>
    </div>
    <client-only>
      <iframe 
      v-if="recipe?.video_url" 
      height="400" 
      class="w-full min-w-full" 
      :src="`https://www.youtube.com/embed/${recipe.video_url.slice(-11)}`" 
      allowfullscreen>
      </iframe>
    </client-only>
  </div>
</template>
<style>
  
</style> 