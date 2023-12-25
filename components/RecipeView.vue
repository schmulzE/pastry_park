<script lang="ts" setup>
import { IRecipe } from '~/types';
const recipeStore = useRecipeStore()
const props = defineProps(['recipe'])


const handleRating = async(value: number) => {
  try {
    props.recipe.rating = value
    await recipeStore.update(props.recipe._id, props.recipe.rating)   
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div class="p-8">
   <h1 class="text-3xl lg:text-6xl uppercase font-bold my-2"> {{ recipe.title }}</h1>
   <hr v-if="recipe.title" class="bg-gray-500 lg:bg-gray-900"/>
   <h1 class="text-4xl my-2"> {{ recipe.description }}</h1>
   <StarRating v-if="recipe._id" @rating="handleRating" :currentRating="recipe.rating"/>

   <div v-if="recipe.image" class=" w-full lg:bg-auto bg-center lg:bg-center bg-no-repeat bg-gray-200 h-48 lg:h-96 my-2" :style="{ backgroundImage: `url('${recipe.image}')`, minHeight: '200px' }"/>
    <div class="my-4 flex justify-between">
      <div>
        <a :href="recipe.url" target="_blank" class="capitalize font-medium text-xl link">{{ recipe.source }}</a>
        <h2 v-if="recipe.yields" class="capitalize my-1 text-lg"> serves: {{ recipe.yields }}</h2>
      </div>

      <div>
        <ul class="flex gap-x-4">
          <li v-for="item in recipe.cookingtime" :key="item.id">
            <h1 class="text-lg font-medium uppercase">{{ item.title }}</h1>
            <span v-if="item.hours" class="">{{ item.hours }} hrs </span>
            <span v-if="item.minutes" class="">{{ item.minutes }} mins</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="hidden lg:flex lg:justify-between lg:gap-x-8">
      <ul class=" p-2 w-1/2 space-y-4" >
        <li v-for="item in recipe.ingredients">{{ item }}</li>
      </ul>
      <ul class=" w-1/2 p-2 space-y-4">
        <li v-for="step in recipe.steps">{{ step }}</li>
      </ul>
      <!-- <client-only placeholder="loading...">
        <HtmlView :html="`${htmlString}`" :tags="['p', 'b', 'i', 'h1', 'strong', 'li']"/>
      </client-only> -->
    </div>
    <client-only>
      <iframe 
      v-if="recipe.video_url" 
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