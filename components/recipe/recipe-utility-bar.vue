<script lang="ts" setup>
const emit = defineEmits([
  'edit-recipe', 
  'maximize-recipe', 
  'delete-recipe', 
  'scale-ingredient', 
  'print-recipe', 
  'grocery-list', 
  'share-recipe'
]);

const editRecipeHandler = () => {
  emit('edit-recipe')
}
const maximizeRecipeHandler = () => {
  emit('maximize-recipe')
}

const deleteRecipeHandler = () => {
  emit('delete-recipe')
}
const ingredientScaleHandler = () => {
  emit('scale-ingredient')
}
const printRecipeHandler = () => {
  emit('print-recipe')
}
const groceryListHandler = () => {
  emit('grocery-list')
}
const shareRecipeHandler = () => {
  emit('share-recipe')
}

</script>

<template>
  <div class="navbar h-4 px-4 space-x-10 z-20 fixed bottom-0 w-full md:navbar md:space-x-4 md:fixed md:w-full md:top-0 md:z-10 md:px-4 lg:navbar lg:w-full bg-gray-100 lg:space-x-6 lg:fixed lg:top-0 lg:z-10 lg:px-8 ">
    <button type="button" @click="editRecipeHandler">
      <i class="i-ri-pencil-fill text-2xl lg:text-2xl md:text-xl"></i>
    </button>
    <button type="button" @click="groceryListHandler">
      <i class="i-mdi-cart-plus text-2xl md:text-xl lg:text-2xl"></i>
    </button>
    <button class="hidden md:block lg:block" type="button" @click="maximizeRecipeHandler">
      <i class="i-mdi-arrow-expand text-2xl md:text-xl lg:text-2xl"></i>
    </button>
    <button type="button" class="" @click="shareRecipeHandler">
      <i class="i-ri-share-fill text-2xl md:text-xl lg:text-2xl"></i>
    </button>
    <button type="button" @click="ingredientScaleHandler">
      <i class=" i-ri-ruler-fill text-2xl md:text-xl lg:text-2xl"></i>
    </button>
    <button type="button" @click="printRecipeHandler">
      <i class="i-ri-printer-fill text-2xl md:text-xl lg:text-2xl"></i>
    </button>
    <button type="button" @click="deleteRecipeHandler">
      <i class=" i-ri-delete-bin-7-line text-2xl md:text-xl lg:text-2xl"></i>
    </button>
  </div>
</template>
