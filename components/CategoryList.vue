<script lang="ts" setup>
import { IRecipe } from '~/types';

const props = defineProps({
  recipes: {
    type: Array<IRecipe>,
    required: true
  }
})
interface ICategory {
  id: string;
  lists: IRecipe[]
}

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
  'Decorative Pastries'
]

const showbutton  = ref(false);
const loading = ref(false);
const showModal = ref(false);
const confirm = ref(false);
const recipeToDeleteId = ref<string | null>(null);

const showModalHandler = (itemId: string) => {
  recipeToDeleteId.value = itemId;
  showModal.value = true;
  confirm.value = false; // Reset confirmation
}
const sortbyCategory = (name: string) => {
  return props.recipes.filter((recipe) => recipe.category == name)
}
const category: ICategory = (Object as any).assign.apply(null, pastries.map(x => ({ [x]: { 'name': x, 'lists': sortbyCategory(x)} })));

const deleteRecipe = async() => {
  try {
    loading.value = true;
    await $fetch(`/recipe/${recipeToDeleteId.value}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.log(error)
  }finally {
    recipeToDeleteId.value = null
    loading.value = false
    showModal.value = false
  }
}
</script>

<template>
  <ul class="menu bg-base-100 lg:bg-gray-100 w-full rounded-box lg:h-auto h-full">
    <li v-for="(pastry, index) in Object.values(category)" :key="index">
      <details open>
        <summary class="font-medium">{{ pastry.name }}</summary>
        <ul>
          <li class="flex flex-row" v-for="list in pastry.lists" :key="list._id" @mouseenter="showbutton= true"  @mouseleave="showbutton=false" >
            <NuxtLink class="flex-1" :to="`/browse/${list.category.replaceAll(' ', '-').toLowerCase()}/${list._id}`">
              <span class="capitalize">{{ list.title }}</span>
            </NuxtLink> 
            <div class="dropdown dropdown-bottom dropdown-end hover:bg-transparent ">
              <i tabindex="0" role="button" class="i-ph-dots-three-vertical-bold"></i>
              <ul tabindex="0" class="dropdown-content menu z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><NuxtLink :to="`/recipe/edit/${list.category.replaceAll(' ', '-').toLowerCase()}/${list._id}`">Edit</NuxtLink></li>
                <li><a @click="showModalHandler(list._id)">Delete</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </details>
    </li>
    <div v-show="showModal" class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/[0.6] z-50">
    <div class="bg-white rounded-lg w-1/2 max-w-lg">
      <div class="flex flex-col items-start p-4">
        <div class="flex items-center w-full">
          <div class="text-gray-900 font-medium text-2xl capitalize">delete recipe</div>
            <svg  @click="showModal = false" class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </div>
          <hr/>
            <div class="mt-6">Deleting a recipe cannot be undone. Are you sure you want to permanently delete it?</div>
          <hr/>
          <div class="ml-auto flex space-x-4 mt-4">
            <button @click="showModal = false" class="btn btn-sm btn-outline border-[#4b371c] bg-white text-[#4b371c] rounded-none">
              Cancel
            </button>
            <button @click="deleteRecipe()" type="button" class="btn btn-sm bg-[#4b371c] hover:bg-[#4b371c] text-white rounded-none">
              <span  v-if="loading" class="loading loading-spinner"></span>
              Confirm
            </button>
        </div>
      </div>
    </div>
  </div>
  </ul>
</template>