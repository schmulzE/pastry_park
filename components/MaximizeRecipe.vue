<script lang="ts" setup>
import { parseVulgars } from 'vulgar-fractions';
import  { convertToFraction } from '@/utils/fractionConverter';

defineProps(['recipe', 'recipeIngredients'])

let selectedIndices = ref<number[]>([])

const toggleSelection = (index: number ) => {
  const selectedIndex = selectedIndices.value.indexOf(index)
  if (selectedIndex === -1) {
    selectedIndices.value.push(index)
  } else {
    selectedIndices.value.splice(selectedIndex, 1)
  }
}

const isSelected = (index: number) => {
  return selectedIndices.value.includes(index)
}

const showMore = ref(false)

const toggleShowMore = () => {
  showMore.value = !showMore.value
}

</script>

<template>
  <div class="text-content text-accent-color">
    <div class="px-4 md:px-32 lg:px-72">
      <h1 class="text-3xl lg:text-5xl uppercase font-lora font-medium my-2"> {{ recipe.title }} </h1>
      <hr v-if="recipe.title" class="bg-gray-500 lg:bg-gray-900"/>
      <p class="text-3xl italic my-2 line-clamp-3 font-lora" :class="{ 'line-clamp-none': showMore }"> {{ recipe.description }}</p>
      <button @click="toggleShowMore" class="block text-xl text-gray-400 italic">{{ showMore ? 'less' : 'more' }}</button>
      <StarRating v-if="recipe._id" :currentRating="recipe.rating"/>

      <div v-if="recipe.image" class="w-full lg:bg-auto bg-center lg:bg-center bg-no-repeat bg-gray-200 h-48 lg:h-96 my-2" :style="{ backgroundImage: `url('${recipe.image}')`, minHeight: '200px' }"/>
        <div class="my-4 flex justify-between font-mulish">
          <div>
            <a :href="recipe.url" target="_blank" class="capitalize font-medium text-base link">{{ recipe.source }}</a>
            <h2 v-if="recipe.yields" class="capitalize my-1 text-md"> serves: {{ recipe.yields }}</h2>
          </div>

          <div class="font-mulish">
            <ul class="flex gap-x-4">
              <li v-for="item in recipe.cookingtime" :key="item.id">
                <h1 class="text-base font-medium uppercase">{{ item.title }}</h1>
                <span v-if="item.hours" class="">{{ item.hours }} hrs </span>
                <span v-if="item.minutes" class="">{{ item.minutes }} mins</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex justify-between gap-x-8 font-mulish">
          <ul class="py-2 w-1/2 space-y-4" >
            <li v-for="(ingredient, index) in recipeIngredients">
              <span 
              @click="toggleSelection(index)" 
              :class="{ 'selected': isSelected(index) }"
              >
              <strong>{{ convertToFraction(ingredient.quantity.replace(/\s+/g, '')) }} {{ ingredient.unit }}</strong> {{ parseVulgars(ingredient.note) }}
              </span>
            </li>
          </ul>
          <ul class=" w-1/2 py-2 space-y-4 font-mulish">
            <li v-for="step in recipe.steps">{{ step }}</li>
          </ul>
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
  </div>
</template>
