<script setup lang="ts">
type VueComponent = InstanceType<typeof component>;
definePageMeta({
  middleware: "auth",
});

import { v4 as uuidv4 } from 'uuid';
import { extend } from "@vue/shared";
import RecipeForm from "~/components/RecipeForm.vue";
import RecipeSteps from "~/components/RecipeSteps.vue";
import RecipeIngredient from "~/components/RecipeIngredient.vue";
import { ICookingtime, IRecipe, IRecipeIngredient } from "~/types";
import { useIngredientParser } from '~/composables/useIngredientParser';


const route = useRoute();
const router = useRouter();
const component = extend({});
const createdRecipe = ref<IRecipe| null>(null);
const { parseIngredients } = useIngredientParser();

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
  created_by: '',
  rating: 0,
})

let recipeIngredients = ref<IRecipeIngredient[]>([]) 

const handleRecipeTitle = (value: string) => {
  recipe.title = value;
}
const handleRecipeDesc = (value: string) => {
  recipe.description = value;
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
    id: uuidv4(),
    title,
    hours,
    minutes,
  })
}

const handleIngredient = (content: string) => {
  //get the contents i.e '<p>ingredient1</p><p>ingredient2</p>' and convert to this ['ingredient1', 'ingredient2'] using replace and split method
  const arrayOfString = content.replace(/<\/p><p>/g, '|').replace(/<\/?p>/g, '').split('|');
  recipe.ingredients = arrayOfString as unknown as any
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

onMounted(() => {
  recipe.category = route.params.category as string
})

const submitRecipeHandler = async () => {
  try {
    const res = await	$fetch("/recipe", {	method: "POST", body: recipe })
    createdRecipe.value = (res as any).recipe;
  } catch (e) {
    console.log(e)
  }finally{
    console.log('created recipe', createdRecipe.value)
    let recipeName = createdRecipe.value?.title.replaceAll(' ', '-').toLowerCase()
    router.push({ path: `/browse/${route.params.category}/${recipeName}/${createdRecipe.value?._id}`})
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

const extractRecipeByUrl = async (url : string) => {
  try {
    // Fetch the HTML content of the recipe page
    const data = await $fetch<any>('/recipe/import-website', {
      method: 'POST',
      body: { url }
    });
    Object.assign(recipe, data.recipe)
    recipeIngredients.value = parseIngredients(data.recipe.ingredients as unknown as string[]);
  } catch (error: any) {
    console.error('Error fetching recipe metadata:', error.message);
  }
}
const extractRecipeFromText = async(text : string) => {
  try {
    //extract the  recipe from the text
    const data = await $fetch<any>('/recipe/import-text', {
      method: 'POST',
      body: { text }
    });
    Object.assign(recipe, data.recipe)
    recipeIngredients.value = parseIngredients(data.recipe.ingredients as unknown as string[]);
  } catch (error: any) {
    console.error('Error retrieving recipe from text:', error.message);
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
      extractRecipeByUrl,
      extractRecipeFromText
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
      <div class="flex justify-between p-4 bg-gray-100 font-source md:text-lg">
        <button @click="router.back()" class="text-sm capitalize"><i class="i-ri-arrow-left-s-line text-2xl"></i></button>
        <button class="text-xl capitalize">recipe form</button>
        <button @click="submitRecipeHandler" class="text-xl capitalize">save</button>
      </div>
      
      <div class="bg-gray-100 text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul class="flex flex-wrap justify-center ">
          <li class="mr-9 text-center space-x-8" v-for="tab in tabs">
            <a 
            @click="changeTab(tab)" 
            href="#" 
            class="inline-block p-4 border-b-2 w-full hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"
            :class="{'text-[#4b371c] border-[#4b371c]': currentComponent === tab.component}"
            >
            {{ tab.name }}
          </a>
          </li>
        </ul>
      </div>
    </template>
    <template #sidebar>
      <div class="pt-4 pb-28 lg:pb-28 overflow-y-auto md:overflow-y-hidden lg:overflow-y-auto h-[530px] md:h-full lg:h-[550px] md:pb-0 relative">
        <component :is="RecipeForm" v-bind="currentProperties"/>
      </div>
    </template>
    <template #main>
      <RecipeView 
      :recipe="recipe" 
      :recipeIngredients="recipeIngredients" 
      class="hidden md:block lg:block"
      />
      <div class="md:hidden lg:hidden">
        <keep-alive>
          <component :is="currentComponent" v-bind="currentProperties" />
        </keep-alive>
      </div>
    </template>
  </NuxtLayout>
</template>