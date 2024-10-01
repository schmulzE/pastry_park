<script lang="ts" setup>
import { IRecipe } from '~/types';
definePageMeta({
  middleware: "auth",
});
const route = useRoute();
const router = useRouter();

const { data: recipes } = await useFetch<IRecipe[]>('/recipe');
let category = route.params.pastry as string;
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100">
        <button @click="router.back()" class="text-sm capitalize">
          <i class="i-ri-arrow-left-line text-2xl"></i>
        </button>
        <h1 class="text-xl font-medium capitalize">{{ category }}</h1>
        <NuxtLink to="">
          <i class="i-ri-add-line text-2xl"></i>
        </NuxtLink>
      </div>
    </template>
    <template #sidebar>
    <CategoryList :recipes="recipes!" :category="category" class="hidden md:flex lg:flex" />
    </template>
    <template #main>
      <RecipeList :recipes="recipes!" :category="category" class="md:hidden lg:hidden"/>
      <CategoryList :recipes="recipes!" class="hidden md:hidden lg:hidden" />
    </template>
  </NuxtLayout>
</template>
