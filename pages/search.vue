<script setup lang="ts">
import { IRecipe, IRecipeIngredient } from '~/types';
import { useIngredientParser } from '~/composables/useIngredientParser';

definePageMeta({
  middleware: 'auth',
});

const query = ref('');
const route = useRoute();
const recipe = ref<IRecipe>();
const recipes = ref<IRecipe[]>([]);
let category = ref<string | null>('');
const { parseIngredients } = useIngredientParser();
const recipeIngredients = ref<IRecipeIngredient[]>();

async function submit(e: KeyboardEvent) {
  if (e.key !== 'Enter') return;

  const trimmedQuery = query.value.trim();
  
  if (!trimmedQuery) {
    throw new Error('Query cannot be blank');
  }

  try {
    const { result } = await $fetch<{ result: any }>('/api/search', {
      method: 'POST',
      body: { query: trimmedQuery.toLowerCase() }
    });

    query.value = '';

    recipes.value = result;

  } catch (error) {
    console.error('Error searching recipes:', error);
    // Handle error (e.g., show user-friendly message)
  }
}

const getAllRecipes = async () => {
  try {
    let res = await $fetch<IRecipe[]>("/recipe", { method: "GET"});
    recipes.value = res
  } catch (e) {
    console.log(e)
  }
}

const displayRecipe = async (id: string) => {
  try {
    let data = await $fetch<IRecipe>(`/recipe/${id}`);
    recipe.value = data as IRecipe
    recipeIngredients.value = parseIngredients(recipe.value.ingredients);
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
 category.value =  process.client  ? localStorage.getItem('category') : 'shortcrust'
})
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="text-center text-xl p-4 bg-gray-100">
        Search
      </div>
    </template>
    <template #sidebar>
      <div class="flex items-center p-4">
        <div class="flex border-b border-gray-400 w-full p-2">
          <input v-model="query" placeholder="title, author, ingredients..." class="bg-gray-100 font-mulish flex-1 text-lg focus:border-none focus:outline-none" @keypress="submit($event)"/>
          <i class="i i-ri-search-2-line text-2xl text-gray-400 font-bold cursor-pointer" placeholder="search recipe"></i>
        </div>
        <button class="btn btn-sm rounded-none btn-neutral" @click="getAllRecipes">all</button>
      </div>
      <div class="overflow-y-auto h-[450px] pb-8">
        <RecipeCard v-for="recipe in recipes" :recipe="recipe" @display-recipe="displayRecipe"/>
      </div>
    </template>
    <template #main>
      <RecipeView :recipe="recipe" :recipeIngredients="recipeIngredients!" v-if="recipe" class="hidden lg:block"/>
      <div class="flex md:hidden lg:hidden px-2 mt-16 md:mt-4 lg:mt-4">
        <div class="flex border-b border-gray-400 w-full p-2">
          <input 
          v-model="query" 
          class="bg-white text-xl lg:bg-gray-100 flex-1 focus:border-none focus:outline-none" 
          placeholder="title, ingredient, or author..." 
          @keypress="submit($event)"
          />
          <i class="i i-ri-search-2-line text-xl text-gray-400 font-bold cursor-pointer hidden md:block lg:block" ></i>
        </div>
        <button class="btn btn-xs rounded-none btn-neutral mt-2" @click="getAllRecipes">all</button>
      </div>
      <RecipeCard v-for="recipe in recipes" :recipe="recipe" @display-recipe="displayRecipe" class="block lg:hidden"/>
   </template>
   <template #footer>
    <div class="flex justify-between content-center px-2">
      <NuxtLink to="/browse" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-book-3-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/browse' }"></i>
      </NuxtLink>
      <NuxtLink to="/search" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-search-line text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path ==  '/search' }"></i>
      </NuxtLink>
      <NuxtLink :to="`/${category}/add-recipe`" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-add-box-fill text-3xl bg-gray-400" :class="{ 'bg-gray-700': route.path == `${category}/add-recipe` }"></i>
      </NuxtLink>
      <NuxtLink to="/grocery-list" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-shopping-cart-2-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/grocery-list' }"></i>
      </NuxtLink>
      <NuxtLink to="/account" class="btn btn-ghost btn-circle">
        <i class="i-ph-gear text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/account' }"></i>
      </NuxtLink>
    </div>
   </template>
  </NuxtLayout>
</template>