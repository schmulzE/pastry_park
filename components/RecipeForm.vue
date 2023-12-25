<script lang="ts" setup>
import { ICookingtime } from '~~/types'
import useModalStore from '../stores/useModalStores'
import RecipeEditor from './RecipeEditor.vue'

const store = useModalStore();
const displayTime = ref(false)

// const emit = defineEmits([
//   'recipe-title',
//   'recipe-desc', 
//   'recipe-source', 
//   'recipe-url', 
//   'recipe-yield', 
//   'recipe-cookingtime', 
//   'recipe-ingredient', 
//   'recipe-steps', 
//   'recipe-image',
//   'recipe-video_url',
//   'recipe-category',
//   'submit-recipe',
//   'fetch-metadata',
//   'clear-form'
// ])

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
  'fetchUrlMetaData'
])

const pastries = [
  'Shortcrust Pastry', 
  'Puff Pastry', 
  'Choux Pastry', 
  'Phyllo (Filo) Pastry', 
  'Sponge Pastry', 
  'Yeast-Risen Pastry',
  'Fried Pastry',
  'Savory Pastries',
  'Sweet Pastries',
  'Decorative Pastries',
]

function openIngredientModal() {
  store.openModal({ component: RecipeEditor,
  props: {payload: props.recipe.ingredients, text: 'ingredient', callbackFn: addIngredient}
  });
}

function openStepsModal() {
  store.openModal({ component: RecipeEditor,
  props: {payload: props.recipe.steps, text: 'steps', callbackFn: addRecipeStep}
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
    id: crypto.randomUUID(),
    title: "",
    hours: 0,
    minutes: 0,
  })
}


  const onChange = (e :any) => {
    displayFile(e.target.files[0])
  }
   
  const displayFile = (item: Blob) => {
    const file = item;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      props.recipe.image = e.target!.result;
      // console.log(props.recipe.image)
    });

    fileReader.readAsDataURL(file);
  }

  const drop = (event :any) => {
    event.preventDefault();
    displayFile(event.dataTransfer.files[0]); // Trigger the onChange event manually
  }

  const paste = (event :any) => {
    event.preventDefault();
    displayFile(event.dataTransfer.files[0]); // Trigger the onChange event manually
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
  props.handleRecipeYield(e.target.value)
}
const submitVideourl = (e: any) => {
  props.handleRecipeVideo(e.target!.value)
  e.target.value = ''
}
const selectCategory = (e: any) => {
  props.handleRecipeCategory(e.target.value)
}

const handleRecipeSubmit = async (e: Event) => {
  e.preventDefault()
  await props.submitRecipeHandler()
}

const showFirstModal = ref(false);
const showSecondModal = ref(false);
const showThirdModal = ref(false);
const loading = ref(false)
const website = ref('');

const fetchDataFromUrl = async(e: any) => {
  try {
    loading.value = true
    await props.fetchUrlMetaData(website.value) 
  } catch (error) {
    console.log(error)
  }finally{
    loading.value = false
    showThirdModal.value = false
    website.value = ''
  }
}

const clearFormData = () => {
  props.resetForm()
}


const input = ref<any>(null);

const openInput = () => {
  input.value!.click()
}

</script>

<template>
  <div class="px-4">
    <h1 class="italic text-xl mb-4">import recipe from:</h1>
    <button @click.prevent="showThirdModal = true" class="bg-gray-200 w-1/2 p-2 uppercase">
      website
    </button>

    <!-- component -->
    <div v-show="showThirdModal" class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/[0.6] z-50">
      <div class="bg-white rounded-lg w-1/2 max-w-lg">
        <div class="flex flex-col items-start p-4">
          <div class="flex items-center w-full">
            <div class="text-gray-900 font-medium text-lg">Paste URL to import recipe</div>
              <svg  @click="showThirdModal = false; website = ''" class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
              </svg>
            </div>
            <hr>
            <label for="website" class="text-xs block"> url</label>
            <input type="input" v-model="website" id='website' autocomplete="off" class="py-2 w-full border-b outline-none border-gray-300"/>
            <hr>
            <div class="ml-auto space-x-4 mt-4">
              <button @click.prevent="fetchDataFromUrl" class="bg-[#0D0D0D] hover:bg-[#252525] text-white font-medium py-2 px-4 rounded uppercase">
              <span v-show="loading" class="loading loading-spinner">spinner</span>
                import
              </button>
            </div>
          </div>
        </div>
      </div>
      <h1 class="text-xl italic my-4">Or enter one below</h1>
    </div>

  <form class="relative px-4 " @submit="handleRecipeSubmit">
    <label for="title" class="text-xs block mt-4 lg:mt-0">title</label>
    <input class="focus:outline-none w-full border-gray-300 bg-white lg:bg-gray-100 border-b py-2" :value="recipe.title" name="title" id="title" @input="inputTitle($event)"  required type="text" />
    <button @click.prevent="openIngredientModal" class="hidden lg:block btn btn-sm my-4 w-full hover:bg-gray-200  hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 border uppercase text-md btn-outline py-2 rounded-sm">add ingredient</button>
    <button @click.prevent="openStepsModal" class="hidden lg:block btn btn-sm mb-4 w-full hover:bg-gray-200  hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 border uppercase text-md btn-outline py-2 rounded-sm">add steps</button>
      
    <div class="flex justify-between mt-4 lg:mt-0">
      
    <button type="button" @click.prevent="showFirstModal = true" class="btn btn-sm btn-outline hover:bg-gray-300 rounded-none hover:text-gray-600 border-gray-300 hover:border-gray-400 text-gray-600 w-32" >video</button>
    <!-- component -->
      <div v-show="showFirstModal" class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/[0.6] z-50">
        <div class="bg-white rounded-lg w-1/2 max-w-lg">
          <div class="flex flex-col items-start p-4">
            <div class="flex items-center w-full">
              <div class="text-gray-900 font-medium text-lg capitalize">paste youtube url</div>
                <svg  @click="showFirstModal = false" class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                </svg>
              </div>
              <hr>
              <label for="youtube_url" class="text-xs block">url</label>
              <input type="url" :value="recipe.video_url" id='youtube_url' class="py-3 w-full border-b outline-none border-gray-300" @change="submitVideourl"/>
              <hr>
              <div class="ml-auto space-x-4 mt-4">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  submit
                </button>
                <button @click="showFirstModal = false" type="button" class="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  Close
                </button>
            </div>
          </div>
        </div>
      </div>
    
       <button @click="showSecondModal = true" class="hidden lg:block btn btn-outline rounded-none btn-sm hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 w-32" type="button" onclick="my_modal_2.showModal()">image</button>
       <div v-show="showSecondModal" class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/[0.6] z-50">
          <div class="bg-white rounded-lg w-1/2 max-w-lg">
            <div class="flex flex-col items-start p-4">
              <div class="flex items-center w-full">
                <svg  @click="showSecondModal = false" class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                </svg>
              </div>
                <div
                  style="border: 1px dashed black"
                  class="p-14 flex text-center justify-center content-center w-full"
                  ref="draggable-div"
                  @paste.prevent="paste($event)"
                  @dragover.prevent
                  @dragenter.prevent
                  @dragstart.prevent
                  @drop.prevent="drop($event)"
                  >
                    <input
                    type="file"
                    name="file"
                    ref="file"
                    @change="onChange"
                    class="inputfile h-1 w-1 opacity-0 absolute z-0"
                    id="file"
                    accept=".pdf,.jpg,.png,.jpeg,"
                    />
                    <label for="file">
                      <span v-if="!props.recipe.image_url" class="i-mdi-file-image-box text-7xl"></span>
                      <img :src="props.recipe.image_url" v-else />
                      <div class="ml-7 text-md">Select Image to Upload</div>
                      <div>or Drag and Drop, Copy and Paste an Image</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

        <button @click="openInput" class="lg:hidden btn btn-outline rounded-none btn-sm hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 w-32" type="button">image</button>
        <input
        type="file"
        name="file"
        ref="input"
        @change="onChange"
        class="inputfile h-1 w-1 opacity-0 absolute"
        id="file"
        accept=".pdf,.jpg,.png,.jpeg,"
        />
      </div>
      <button v-show="recipe.cookingtime.length !== 3" @click.prevent="addCookingTime" class="btn btn-sm rounded-sm hover:bg-gray-200 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 mb-2 mt-4 w-full uppercase text-md btn-outline py-2">add cooking time</button>

        <div class=" flex w-full relative"  v-for="(item) in recipe.cookingtime" :key="item.id">
          <div>
            <label for="cookingtitle" class="mt-5 text-xs block">title</label>
            <input type="text" v-model="item.title" required class="mt-5 p-1 outline-none border-b border-gray-300 bg-white lg:bg-gray-100 w-28"  />
          </div>
          <div class="mx-2">
            <label for="hour" class="mt-5 text-xs block">minutes</label>
            <input type="number"  required v-model="item.hours" min="0" max="59" class="p-1 outline-none w-14 mt-5 text-center border-b border-gray-300 bg-white lg:bg-gray-100" />
          </div>
          
          <div>
            <label for="min" class="mt-5 text-xs block">hours</label>
            <input type="number" required v-model="item.minutes" min="0" max="12" class="p-1 border-b outline-none w-14 mt-5 border-gray-300 text-center bg-white lg:bg-gray-100"/>
          </div>
          <button @click.stop="closeDialog(false, item.id)" class="btn btn-sm btn-circle btn-ghost absolute top-12 right-4  hover:bg-transparent">
            <i class="ri i-ri-close-line text-2xl text-gray-400"></i>
          </button>
        </div>
      <label for="description" class="text-xs block mt-4">description</label>
      <textarea row="0" :value="recipe.description" class="w-full border-gray-300 bg-white lg:bg-gray-100 border-b outline-none" name="description" id="description" type="text" @input="e => inputDescription(e)"></textarea>

      <label for="source" class="text-xs block mt-4">source</label>
      <input :value="recipe.source" autocomplete="off" class="w-full border-gray-300 bg-white lg:bg-gray-100 border-b outline-none py-2" name="source" id="source" type="text" @input="inputSource"/>

      <label for="url" class="text-xs block mt-4">url</label>
      <input type="url" :value="recipe.url" autocomplete="off" class="w-full border-gray-300 bg-white lg:bg-gray-100 border-b outline-none py-2" name="url" id="url" @input="inputUrl"/>

      <label for="yield" class="text-xs block mt-4">yield</label>
      <input autocomplete="off" :value="recipe.yields" class=" w-full border-b border-gray-300  bg-white lg:bg-gray-100 outline-none py-2" name="yield" id="yield" type="text" @input="inputYield"/>

      <select @change="selectCategory" name="category" class="select select-sm rounded-none focus:outline-gray-40 bg-white lg:bg-gray-100 border-gray-300 selected:outline-gray-400 hover:outline-gray-400 select-warning w-full max-w-xs mt-8">
        <option v-if="recipe.category" disabled selected>{{ recipe.category}}</option>
        <option v-else disabled selected>select a pastry</option>
        <option  v-for="(pastry, index) in pastries" :key="index">{{ pastry }}</option> 
      </select>
    <div class="hidden lg:flex justify-between fixed bottom-4 w-80">
      <button type="button" @click="clearFormData" class="btn btn-sm btn-outline border-[#4b371c] bg-gray-100 text-[#4b371c] rounded-none">cancel</button>
      <button type="submit" class="btn btn-sm bg-[#4b371c] hover:bg-[#4b371c] text-white rounded-none w-32">save recipe</button>
    </div>
  </form>
</template>

<style lang="css" scoped>
  
</style>
