<script lang="ts" setup>
const route = useRoute()
import { storeToRefs } from 'pinia'
const recipeStore = useRecipeStore()
import RecipeView from "~/components/RecipeView.vue";
import RecipeIngredient from "~/components/RecipeIngredient.vue";
import RecipeSteps from "~/components/RecipeSteps.vue";
import { IRecipe } from '~/types';
import { extend } from "@vue/shared";

const component = extend({});
type VueComponent = InstanceType<typeof component>;

const [category, recipeId] =  route.params.slug

const { data: response } = await useAsyncData(
  'recipe',
  () => $fetch(`/recipe/${recipeId}`)
)
let recipe = response.value

const { data, pending, refresh } = await useAsyncData(
  'recipes',
  () => $fetch('/recipe')
)
let recipes = data.value as IRecipe[]
let currentComponent = shallowRef(RecipeView)
const tabs = [
  {
    name: "Intro",
    component: RecipeView
  },
  {
    name: "Ingredient",
    component: RecipeIngredient
  },
  {
    name: "Steps",
    component: RecipeSteps
  },

]

const currentProperties = computed(() => {
  if (currentComponent.value.__name === 'RecipeView' ) {
    return { 
      recipe, 
    }
  }else if (currentComponent.value.__name === 'RecipeIngredient') {
   return {
    recipe,
   } 
  }else if (currentComponent.value.__name === 'RecipeSteps') {
   return {
    recipe,
   }
  }
})

const changeTab = (value: VueComponent) => {
  currentComponent.value = value.component
}
 const showFirstModal = ref(false)
</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100">
        <button @click="$router.back()" class=" capitalize"><i class="i-ri-arrow-left-s-line text-3xl"></i></button>
        <h1 class="text-lg font-bold capitalize">recipe</h1>
        <button @click="showFirstModal = true" class="text-xl capitalize"><i class="i-ri-more-2-fill"></i></button>
      </div>

      <div v-show="showFirstModal" @click="showFirstModal = false" class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/[0.1] z-50">
        <div class="bg-white rounded-lg  absolute top-12 right-2">
          <div class="flex flex-col items-start p-4">
              <!-- body -->
              <ul class="capitalize">
                <li>edit</li>
                <li>delete</li>
              </ul>
          </div>
        </div>
      </div> 
      
      <div class="bg-gray-100 text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul class="flex flex-wrap justify-center">
          <li class="mr-9 text-center space-x-8" v-for="tab in tabs">
            <a @click="changeTab(tab)" href="#" class="inline-block p-4 border-b-2 hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"  :class="{'text-[#4b371c] border-[#4b371c]': currentComponent === tab.component}">{{ tab.name }}</a>
          </li>
        </ul>
      </div>
    </template>
    <template #sidebar>
      <CategoryList :recipes="recipes"/>
    </template>
    <template #main>
        <!-- <RecipeView :recipe="recipe"/> -->
        <div class="">
          <component :is="currentComponent" v-bind="currentProperties" />
        </div>
    </template>
  </NuxtLayout>
</template>
