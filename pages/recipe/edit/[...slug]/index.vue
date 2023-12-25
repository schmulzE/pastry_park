<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ICookingtime, IRecipe } from '~/types';
import RecipeForm from "~/components/RecipeForm.vue";
import RecipeIngredient from "~/components/RecipeIngredient.vue";
import RecipeSteps from "~/components/RecipeSteps.vue";
import { extend } from "@vue/shared";

const component = extend({});
type VueComponent = InstanceType<typeof component>;

const route = useRoute()
const router = useRouter()
const user = useAuthUser();
const [category, recipeId] =  route.params.slug


let recipe = reactive<IRecipe>({
  title: '',
  description: '',
  source: '',
  yield: '',
  cookingtime: <ICookingtime[]>[],
  image: '',
  video_url: '',     
  url: '', 
  ingredients: '',
  steps: '',
  category: '',
  user_id: '',
  rating: 0,
})

const { data: response } = await useAsyncData(
  'single_recipe',
  () => $fetch(`/recipe/${recipeId}`, {
    
  })
)
 recipe = response.value! as IRecipe
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
  recipe.yield = value
}
const handleRecipeUrl = (value: string) => {
  recipe.url = value
}

const handleCookingtime = (title: string, hours: number, minutes: number )=> {
  recipe.cookingtime.push({
    id: crypto.randomUUID(),
    title,
    hours,
    minutes,
  })
}
const handleIngredient = (content: string) => {
  recipe.ingredients = content
}
const handleRecipeSteps = (content: string) => {
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
const handleCategory = (content: string) => {
  recipe.category = content
}

const recipeStore = useRecipeStore()

const submitRecipeHandler = async () => {
  try {
    await recipeStore.update(recipeId, recipe)   
  } catch (e) {
    console.log(e)
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
