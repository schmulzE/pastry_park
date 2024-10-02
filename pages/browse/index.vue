<script lang="ts" setup>
import { IRecipe } from '~/types';
import { useScreenDetection } from '~/composables/useScreenDetection';
import { useRoute } from 'vue-router'

const route = useRoute()
// console.log('currentPath:', route.path)
definePageMeta({
  middleware: "auth",
});

const { data: recipes } = await useFetch<IRecipe[]>('/recipe');
let category = process.client ? localStorage.getItem('category') : 'shortcrust'

const { redirectIfDesktop } = useScreenDetection();
const desktopRoute = category ? `/browse/${category}` : `/browse/shortcrust`;

const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
  redirectIfDesktop(desktopRoute!);
})
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100 font-source text-base">
        <button class="text-sm capitalize">
          <i class="i-ri-arrow-left-line text-2xl"></i>
        </button>
        <h1 class="text-xl font-medium">browse</h1>
        <div></div>
      </div>
    </template>
   <template #sidebar>
    <CategoryList :recipes="recipes!" :category="category!" class="hidden md:flex lg:flex" />
  </template>
  <template #main>
    <h1 class="block m-4 text-2xl font-source md:hidden lg:hidden">Categories</h1>
    <CategoryList :recipes="recipes!" class="block md:hidden lg:hidden" />
   </template>
  <template #footer>
    <div class="flex justify-between content-center px-2">
      <NuxtLink to="/browse" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-book-3-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/browse' }"></i>
      </NuxtLink>
      <NuxtLink to="/search" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-search-line text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path ==  '/search' }"></i>
      </NuxtLink>
      <NuxtLink :to="`/${category?.toLowerCase()}/add-recipe`" class="btn btn-ghost btn-circle">
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
