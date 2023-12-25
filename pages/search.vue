<script setup lang="ts">
definePageMeta({
  middleware: ["user-only"],
});
import { IRecipe } from '~/types';
const recipeStore = useRecipeStore()

let recipes = ref<IRecipe[]>([])
let recipe = ref<IRecipe>()
let query = ''

async function submit(e: any) {
  if(e.which == 13) {
    if(e.target.value === '') {
      throw new Error('Cannot be blank')
    }
    const { result } = await $fetch<any>('/recipe/search', {
      method: 'post',
      body: {query}
    })
    recipes.value = result
  }
}

const getAllRecipes = async () => {
  try {
   const data =  await recipeStore.getAll()
    recipes.value = data as IRecipe[]
  } catch (e) {
    console.log(e)
  }
}

const displayRecipe = async (id: string) => {
  try {
   const data =  await recipeStore.fetchById(id)
    recipe.value = data as IRecipe
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="text-center p-4 bg-gray-100">
        Search
      </div>
    </template>
   <template #sidebar>
    <div class="flex px-4">
      <div class="flex border-b border-gray-400 w-full p-2">
        <input v-model="query" class="bg-gray-100 flex-1 focus:border-none focus:outline-none" @keypress="submit($event)"/>
        <i class="i i-ri-search-2-line text-2xl text-gray-400 font-bold cursor-pointer" placeholder="search recipe"></i>
      </div>
      <button class="btn btn-sm rounded-none btn-neutral" @click="getAllRecipes">all</button>
    </div>
      <Recipe v-for="recipe in recipes" :recipe="recipe" @display-recipe="displayRecipe"/>
    </template>
   <template #main>
      <RecipeView :recipe="recipe" v-if="recipe" class="hidden lg:block"/>
      <div class="flex lg:hidden px-2 mt-4">
        <div class="flex border-b border-gray-400 w-full p-2">
          <input v-model="query" class="bg-white lg:bg-gray-100 flex-1 focus:border-none focus:outline-none" @keypress="submit($event)"/>
          <i class="i i-ri-search-2-line text-xl text-gray-400 font-bold cursor-pointer" placeholder="search recipe"></i>
        </div>
        <button class="btn btn-xs rounded-none btn-neutral mt-2" @click="getAllRecipes">all</button>
      </div>
      <Recipe v-for="recipe in recipes" :recipe="recipe" @display-recipe="displayRecipe" class="block lg:hidden"/>
   </template>
  </NuxtLayout>
</template>