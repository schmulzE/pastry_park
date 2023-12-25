<script setup lang="ts">
definePageMeta({
    middleware: ["user-only"],
});

import { ICookingtime } from "~/types";
import { storeToRefs } from 'pinia'
import RecipeForm from "~/components/RecipeForm.vue";
import RecipeIngredient from "~/components/RecipeIngredient.vue";
import RecipeSteps from "~/components/RecipeSteps.vue";
import { extend } from "@vue/shared";

const component = extend({});
type VueComponent = InstanceType<typeof component>;
const router = useRouter()

const user = useAuthUser();
let recipe = reactive({
  title: '',
  description: '',
  source: '',
  yields: '',
  cookingtime: <ICookingtime[]>[],
  image: '',
  video_url: '',
  url: '', 
  ingredients: <string[]>[],
  steps: <string[]>[],
  category: '',
  user_id: '',
  rating: 0,
})
// user.value!._doc!._id
const handleRecipeTitle = (value: string) => {
  recipe.title = value
}
const handleRecipeDesc = (value: string) => {
  recipe.description = value
}
const handleRecipeSource = (value: string) => {
  recipe.source = value
}
const handleRecipeYield = (value: string) => {
  recipe.yields = value
}
const handleRecipeUrl = (value: string) => {
  recipe.url = value
}

const handleCookingtime = (title: string, hours: number, minutes: number) => {
  recipe.cookingtime.push({
    id: crypto.randomUUID(),
    title,
    hours,
    minutes,
  })
}

const handleIngredient = (content: string) => {
  //get the contents i.e '<p>ingredient1</p><p>ingredient2</p>' and convert to this ['ingredient1', 'ingredient2'] using replace and split method
  const arrayOfString = content.replace(/<\/p><p>/g, '|').replace(/<\/?p>/g, '').split('|');
  recipe.ingredients = arrayOfString
}
const handleRecipeSteps = (content: string) => {
  const arrayOfString = content.replace(/<\/p><p>/g, '|').replace(/<\/?p>/g, '').split('|');
  recipe.steps = arrayOfString
}
const handleRecipeImage = (content: string) => {
  recipe.image = content
}
const handleRecipeVideo = (content: string) => {

  const urlPattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  function isValidURL(url: string) {
    return urlPattern.test(url);
  }
if(isValidURL(content)) {
    recipe.video_url = content
  }
}
const handleRecipeCategory = (content: string) => {
  recipe.category = content
}

const recipeStore = useRecipeStore()

const submitRecipeHandler = async () => {
  let { singleRecipe, error } = storeToRefs(recipeStore)
  try {
    await recipeStore.create(recipe)   
  } catch (e) {
    console.log(error)
  }finally{
    let categoryName = singleRecipe.value.category.replaceAll(' ', '-').toLowerCase()
    router.push({ path: `/browse/${categoryName}/${singleRecipe.value._id}`})
  }
}

const tabs = [
  {
    name: "Intro",
    component: RecipeForm
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
const fetchUrlMetaData = async (url : string) => {
  try {
    // Fetch the HTML content of the recipe page
    const data = await $fetch<any>('/recipe/scrape', {
      method: 'POST',
      body: { url }
    });
    Object.assign(recipe, data.recipe)
  } catch (error: any) {
    console.error('Error fetching recipe metadata:', error.message);
  }
}


const resetForm = () => {
  recipe.title = ''
  recipe.description = ''
  recipe.source = ''
  recipe.url = ''
  recipe.category = ''
  recipe.image = ''
  recipe.rating = 0
  recipe.video_url = ''
  recipe.steps = []
  recipe.yields = ''
  recipe.ingredients = []
  recipe.cookingtime = []
}

let currentComponent = shallowRef(RecipeForm)

const currentProperties = computed(() => {
  if (currentComponent.value.__name === 'RecipeForm' ) {
    return { 
      recipe, 
      handleCookingtime, 
      handleRecipeTitle, 
      handleRecipeDesc, 
      handleRecipeSource,  
      handleRecipeVideo,
      handleRecipeCategory,
      handleRecipeImage,
      handleRecipeYield,
      handleRecipeUrl,
      handleIngredient,
      handleRecipeSteps,
      submitRecipeHandler,
      resetForm,
      fetchUrlMetaData
    }
  }else if (currentComponent.value.__name === 'RecipeIngredient') {
   return {
    recipe,
    handleIngredient
   } 
  }else if (currentComponent.value.__name === 'RecipeSteps') {
   return {
    recipe,
    handleRecipeSteps
   }
  }
})

const changeTab = (value: VueComponent) => {
  currentComponent.value = value.component
}


</script>

<template>
  <NuxtLayout name="recipe">
    <template #tab>
      <div class="flex justify-between p-4 bg-gray-100">
        <button @click="$router.back()" class="text-sm capitalize"><i class="i-ri-arrow-left-s-line text-2xl"></i></button>
        <button class="text-sm capitalize">recipe form</button>
        <button @click="submitRecipeHandler" class="text-sm capitalize">save</button>
      </div>
      
    <div class="bg-gray-100 text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
      <ul class="flex flex-wrap justify-center ">
        <li class="mr-9 text-center space-x-8" v-for="tab in tabs">
          <a @click="changeTab(tab)" href="#" class="inline-block p-4 border-b-2 hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"  :class="{'text-[#4b371c] border-[#4b371c]': currentComponent === tab.component}">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
    </template>
   <template #sidebar>
    <component :is="RecipeForm" v-bind="currentProperties"/>
   </template>
   <template #main>
     <RecipeView :recipe="recipe" class="hidden lg:block"/>
     <div class="lg:hidden">
      <keep-alive>
        <component :is="currentComponent" v-bind="currentProperties" />
      </keep-alive>
    </div>
    </template>
  </NuxtLayout>
  <Modal />
</template>

<style scoped>

</style>