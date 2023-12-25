<script lang="ts" setup>
import { IRecipe } from '~/types';
const userId =ref('')
const { data, pending, refresh } = await useAsyncData(
  'recipe',
  () => $fetch('/recipe')
  // () => $fetch(`/api/recipes?userId=${userId.value}`)
)
console.log(data)
let recipes = data.value as IRecipe[]


</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100">
        <button class="text-sm capitalize"><i class="i-ri-more-2-fill text-xl"></i></button>
        <h1>pastry park</h1>
        <NuxtLink to="/add-recipe" class="text-sm capitalize"><i class="i-ri-add-fill text-2xl"></i></NuxtLink>
      </div>
    </template>
   <template #sidebar>
    <CategoryList :recipes="recipes" class="hidden lg:block"/>
  </template>
  <template #main>
    <CategoryList :recipes="recipes" class="block lg:hidden"/>
   </template>
  </NuxtLayout>
</template>
