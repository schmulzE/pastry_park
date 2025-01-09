<script lang="ts" setup>
type VueComponent = InstanceType<typeof component>;

import { v4 as uuidv4 } from 'uuid';
import { extend } from "@vue/shared";
import { useToast } from 'vue-toastification';
import { ICookingtime, IRecipe } from '~/types';
import RecipeForm from "~/components/RecipeForm.vue";
import RecipeSteps from "~/components/RecipeSteps.vue";
import RecipeIngredient from "~/components/RecipeIngredient.vue";
import { useIngredientParser } from '~/composables/useIngredientParser';


const toast = useToast();
const route = useRoute();
const router = useRouter();
const component = extend({});
const [category, recipeId] =  route.params.slug;
const { parseIngredients } = useIngredientParser();


let recipe = reactive<IRecipe>({
  title: '',
  description: '',
  source: '',
  yields: '',
  cookingtime: <ICookingtime[]>[],
  image: '',
  video_url: '',     
  url: '', 
  ingredients: [],
  steps: [],
  category: '',
  created_by: '',
  rating: 0,
})

const { data: response } = await useAsyncData(
  'single_recipe',
  () => $fetch(`/recipe/${recipeId}`, {
    
  })
)
recipe = response.value! as IRecipe;
const parsedIngredients = parseIngredients(recipe.ingredients);

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

const handleCookingtime = (title: string, hours: number, minutes: number )=> {
  recipe.cookingtime.push({
    id: uuidv4(),
    title,
    hours,
    minutes,
  })
}

const handleIngredient = (content: string[]) => {
  recipe.ingredients = content
}

const handleRecipeSteps = (content: string[]) => {
  recipe.steps = content
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

// const handleCategory = (content: string) => {
//   recipe.category = content
// }

const submitRecipeHandler = async () => {
  try {
    $fetch(`/recipe/${recipeId}`, {method: "PUT", body: recipe})
  } catch (e) {
    toast("An error occured while submitting recipe. Please try again.", { toastClassName: "my-toast-class" });
  }finally{
   router.push({ path: `/browse/${category}/${recipeId}`})
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

let currentComponent = shallowRef(RecipeForm);

const currentProperties = computed(() => {
  if (currentComponent.value.__name === 'RecipeForm' ) {
    return { 
      recipe, 
      handleCookingtime, 
      handleRecipeTitle, 
      handleRecipeDesc, 
      handleRecipeSource,  
      handleRecipeVideo,
      handleRecipeImage,
      handleRecipeYield,
      handleRecipeUrl,
      handleIngredient,
      handleRecipeSteps,
      submitRecipeHandler,
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
};
</script>

<template>
<NuxtLayout name="recipe">
  <template #tab>
    <div class="flex justify-between p-4 bg-gray-100 font-source">
      <button @click="$router.back()" class="text-sm md:text-xl capitalize"><i class="i-ri-arrow-left-s-line text-2xl"></i></button>
      <button class="text-sm md:text-lg capitalize">recipe form</button>
      <button @click="submitRecipeHandler" class="text-sm md:text-lg capitalize">save</button>
    </div>
    
    <div class="bg-gray-100 text-sm font-medium text-center font-source text-gray-500 border-b border-gray-200 ">
      <ul class="flex flex-wrap justify-center ">
        <li class="mr-9 text-center space-x-8 md:text-xl" v-for="tab in tabs">
          <a 
          @click="changeTab(tab)" 
          class="inline-block p-4 border-b-2 hover:text-[#4b371c] rounded-t-lg hover:border-[#4b371c] uppercase"  
          :class="{'text-[#4b371c] border-[#4b371c] font-medium': currentComponent === tab.component}">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
  </template>
   <template #sidebar>
    <div class="lg:pt-4 lg:pb-28 lg:overflow-y-auto lg:h-[530px] lg:relative">
      <component :is="RecipeForm" v-bind="currentProperties"/>
    </div>
   </template>
   <template #main>
      <RecipeView :recipe="recipe" :recipeIngredients="parsedIngredients" class="hidden lg:block"/>
      <div class="lg:hidden">
        <keep-alive>
          <component :is="currentComponent" v-bind="currentProperties" />
        </keep-alive>
      </div>
   </template>
  </NuxtLayout>
  <Modal />
</template>

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>