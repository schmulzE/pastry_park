<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { ICookingtime } from '~~/types';
import useModalStore from '~/stores/modal';
import RecipeEditor from './recipe-rich-text-editor.vue';
import VideoUrlModal from './recipe-video-url-modal.vue';
import RecipeUrlInputModal from './recipe-url-input-modal.vue';
import RecipeTextInputModal from './recipe-text-input-modal.vue';
import RecipeImageUploadModal from './recipe-image-upload-modal.vue';

const displayTime = ref(false);
const store = useModalStore();
const formLoader = ref(false)

const props = defineProps([
  'recipe', 
  'handleCookingtime', 
  'handleRecipeTitle',
  'handleRecipeDesc', 
  'handleRecipeSource',  
  'handleRecipeVideo',
  'handleRecipeCategory',
  'handleRecipeImage',
  'handleRecipeYield',
  'handleRecipeUrl',
  'handleRecipeSteps',
  'handleIngredient',
  'submitRecipeHandler',
  'resetForm',
  'extractRecipeByUrl',
  'extractRecipeFromText'
])

function openIngredientModal() {
  store.openModal({ component: markRaw(RecipeEditor),
  props: { payload: props.recipe.ingredients, text: 'ingredient', callbackFn: addIngredient, classes: 'h-screen w-screen bg-gray-200 rounded-lg'}
  });
}

function openStepsModal() {
  store.openModal({ component: markRaw(RecipeEditor),
  props: { payload: props.recipe.steps, text: 'steps', callbackFn: addRecipeStep, classes: 'h-screen w-screen bg-gray-200 rounded-lg'}
  });
}

const addIngredient = (value:string) => {
  props.handleIngredient(value)
}
const addRecipeStep = (value:string) => {
  props.handleRecipeSteps(value)
}

const addCookingTime = () => {
  props.recipe.cookingtime.push({
    id: uuidv4(),
    title: "",
    hours: 0,
    minutes: 0,
  })
}

const closeDialog = (value:boolean, id: string) => {
  if (props.recipe.cookingtime.length !== 0) {
    props.recipe.cookingtime = props.recipe.cookingtime.filter((item :ICookingtime) => (item).id !== id)
  }else{
    displayTime.value = value
  }
}

const inputTitle = (e: any) => {
  props.handleRecipeTitle(e.target.value)
}

const inputDescription = (e: any) => {
  props.handleRecipeDesc(e.target.value)
}

const inputSource = (e: any) => {
  props.handleRecipeSource(e.target.value)
}

const inputUrl = (e: any) => {
  props.handleRecipeUrl(e.target.value)
}

const inputYield = (e: any) => {
  props.handleRecipeYield(e.target.value);
}

// const submitVideourl = (e: any) => {
//   props.handleRecipeVideo(e.target!.value);
//   e.target.value = '';
// }

const handleRecipeSubmit = async (e: Event) => {
  e.preventDefault();
  try {
    formLoader.value = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    await props.submitRecipeHandler();
  } catch (error) {
    console.error('Error submitting recipe:', error);
  } finally {
    formLoader.value = false;
  }
}

const clearFormData = () => {
  props.resetForm()
}

const extractRecipeFromWebsiteInputModal = () => {
  store.openModal({
    component: markRaw(RecipeUrlInputModal),
    props: { classes: 'bg-white rounded-lg w-96 max-w-lg shadow-2xl'},
    events: {
      fetch_website_recipe: async(url) => {
        try {
          await props.extractRecipeByUrl(url) 
        } catch (error) {
          console.log(error)
        }finally{
          store.closeModal()
        }
      }
    },
  });
}

const extractRecipeFromTextInputModal = () => {
  store.openModal({
    component: markRaw(RecipeTextInputModal),
    props: { classes: 'bg-white rounded-lg w-96 max-w-lg shadow-2xl' },
    events: {
      extract_recipe: async(url) => {
        try {
          await props.extractRecipeFromText(url) 
        } catch (error) {
          console.log(error)
        }finally{
          store.closeModal()
        }
      }
    },
  });
}

const showVideoUrlModal = () => {
  store.openModal({
    component: markRaw(VideoUrlModal),
    props: { videoUrl: props.recipe.video_url, classes: 'bg-white rounded-lg w-96 max-w-lg shadow-2xl' },
    events: {
      update_video_url: (url) => {
        props.handleRecipeVideo(url);
      }
    },
  });
}

const showImageUploadModal = () => {
  store.openModal({
    component: markRaw(RecipeImageUploadModal),
    props: { classes: 'bg-white rounded-lg w-1/2 max-w-lg' },
    events: {
      update_recipe_image: (img) => {
        props.handleRecipeImage(img);
      }
    },
  });
}

</script>

<template>
  <div class="mt-32 md:mt-0 lg:mt-0 px-4">
    <h1 class="italic text-xl mb-4">import recipe from:</h1>
    <div class="flex space-x-2 ">
      <button @click.prevent="extractRecipeFromWebsiteInputModal" class="bg-gray-200 w-1/2 p-2 uppercase text-md">
        website
      </button>
      <button @click.prevent="extractRecipeFromTextInputModal" class="bg-gray-200 w-1/2 p-2 uppercase text-md">
        text
      </button>
    </div>
    <h1 class="text-xl italic my-4">Or enter one below</h1>
  </div>

  <form class="relative px-4 " @submit="handleRecipeSubmit">
    <label for="title" class="text-xs block mt-4 lg:mt-0">title</label>
    <input class="focus:outline-none w-full border-gray-300 bg-white md:bg-gray-100 lg:bg-gray-100 border-b py-2" :value="recipe?.title" name="title" id="title" @input="inputTitle($event)"  required type="text" />
    <button @click.prevent="openIngredientModal" class="hidden lg:block btn btn-sm my-4 w-full hover:bg-gray-200  hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 border uppercase text-md btn-outline py-2 rounded-sm">
      add ingredient
    </button>
    <button @click.prevent="openStepsModal" class="hidden lg:block btn btn-sm mb-4 w-full hover:bg-gray-200  hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 border uppercase text-md btn-outline py-2 rounded-sm">
      add steps
    </button>
      
    <div class="flex justify-between mt-4 lg:mt-0">
      
      <button type="button" @click.prevent="showVideoUrlModal" class="btn btn-sm btn-outline hover:bg-gray-300 rounded-none hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 w-32" >
        video
      </button>
    
      <button 
      @click="showImageUploadModal" 
      class="hidden lg:block btn btn-outline rounded-none btn-sm hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 w-32" 
      type="button" 
      >
      image
      </button>

    </div>

    <button v-show="recipe?.cookingtime.length !== 3" @click.prevent="addCookingTime" class="btn btn-sm rounded-sm hover:bg-gray-200 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 mb-2 mt-4 w-full uppercase text-md btn-outline py-2">
      add cooking time
    </button>

    <div class="flex w-full md:justify-between relative" v-for="(item) in recipe?.cookingtime" :key="item.id">
      <div>
        <label for="cookingtitle" class="mt-5 text-xs block">title</label>
        <input type="text" v-model="item.title" required class="mt-5 p-1 outline-none border-b border-gray-300 bg-white md:bg-gray-100 lg:bg-gray-100 w-24 md:w-48 lg:w-24 capitalize" />
      </div>

      <div class="mx-2">
        <label for="hour" class="mt-5 text-xs block">minutes</label>
        <input type="number"  required v-model="item.minutes" min="0" max="59" class="p-1 outline-none w-14 md:w-28 lg:w-14 mt-5 text-center border-b border-gray-300 bg-white lg:bg-gray-100" />
      </div>
      
      <div>
        <label for="min" class="mt-5 text-xs block">hours</label>
        <input type="number" required v-model="item.hours" min="0" max="12" class="p-1 border-b outline-none w-14 md:w-28 lg:w-14 mt-5 border-gray-300 text-center bg-white lg:bg-gray-100"/>
      </div>
      <button @click.stop="closeDialog(false, item.id)" class="btn btn-sm btn-circle btn-ghost absolute md:relative top-12 right-4 hover:bg-transparent">
        <i class="ri i-ri-close-line text-2xl text-gray-400"></i>
      </button>
    </div>

    <label for="description" class="text-xs block mt-4">description</label>
    <textarea row="0" :value="recipe?.description" class="w-full border-gray-300 bg-white md:bg-gray-100 lg:bg-gray-100 border-b outline-none resize-none" name="description" id="description" type="text" @input="e => inputDescription(e)"></textarea>

    <label for="source" class="text-xs block mt-4">source</label>
    <input :value="recipe?.source" autocomplete="off" class="w-full border-gray-300 bg-white md:bg-gray-100 lg:bg-gray-100 border-b outline-none py-2" name="source" id="source" type="text" @input="inputSource"/>

    <label for="url" class="text-xs block mt-4">url</label>
    <input type="url" :value="recipe?.url" autocomplete="off" class="w-full border-gray-300 bg-white md:bg-gray-100 lg:bg-gray-100 border-b outline-none py-2" name="url" id="url" @input="inputUrl"/>

    <label for="yield" class="text-xs block mt-4">yield</label>
    <input autocomplete="off" :value="recipe?.yields" class=" w-full border-b border-gray-300  bg-white md:bg-gray-100 lg:bg-gray-100 outline-none py-2" name="yield" id="yield" type="text" @input="inputYield"/>

    <div class="hidden md:flex md:gap-x-4 lg:flex lg:justify-between fixed bottom-2 w-80 md:w-72 lg:w-[300px] md:relative lg:fixed bg-gray-100">
      <button type="button" @click="clearFormData" class="btn btn-sm btn-outline border-[#4b371c] bg-gray-100 text-[#4b371c] rounded-none">
        cancel
      </button>
      <button type="submit" class="btn btn-sm bg-[#4b371c] hover:bg-[#4b371c] text-white rounded-none w-32 md:flex-1 lg:flex-none">
        <span v-show="formLoader" class="loading loading-spinner">spinner</span>
        save recipe
      </button>
    </div>
  </form>
</template>

<style lang="css" scoped>
  
</style>
