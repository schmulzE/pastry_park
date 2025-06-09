<script lang="ts" setup>
import Accordion from '~/components/ui/accordion.vue';
import { GroceryListDocument } from '~/server/models/groceryList';


defineProps<{ groceryList?: GroceryListDocument }>();

const newGroceryItem = ref('');

const emit = defineEmits([
  "copy-grocery-list", 
  "print-grocery-list",
  "delete-completed-grocery-item", 
  "add-grocery-item", 
  "edit-grocery-item", 
  "change-grocery-item-category", 
  "delete-grocery-item"
]);

const copyGroceriesToClipboard = () => {
  emit("copy-grocery-list")
}

const printGroceryList = () => {
  emit("print-grocery-list")
}

const deleteCompletedGroceryItem = () => {
  emit("delete-completed-grocery-item")
}

const addNewGroceryItem = () => {
  emit("add-grocery-item")
}

const editGroceryListItem = (itemId: string) => {
  emit("edit-grocery-item", itemId)
}

const changeGroceryItemCategory = (itemId: string) => {
  emit("change-grocery-item-category", itemId)
}

const deleteGroceryItemById = (itemId: string) => {
  emit("delete-grocery-item", itemId)
}

</script>

<template>
  <div class="h-full pt-24 md:block lg:block bg-white md:h-screen lg:h-screen relative md:pt-48 lg:pt-48 min-w-[834px] font-source">
    <div class="bg-white px-8 py-4 md:fixed lg:fixed md:top-0 lg:top-0 w-full max-w-sm md:max-w-[834px] lg:max-w-[834px] md:z-40 lg:z-40">
      <div class="hidden md:flex lg:flex md:justify-end lg:justify-end md:space-x-6 lg:space-x-6">
        <button @click="copyGroceriesToClipboard"><i class="i-ri-clipboard-line text-3xl"></i></button>
        <button @click="printGroceryList"><i class="i-ri-printer-fill text-3xl"></i></button>
        <button @click="deleteCompletedGroceryItem"><i class="i-mdi-cart-off text-3xl"></i></button>
      </div>
      <h1 class="hidden md:block lg:block capitalize text-3xl font-medium">grocery list</h1>
      <div class="flex gap-x-2 items-center md:flex-none lg:flex-none">
        <input 
        class="w-full bg-gray-100 rounded-full py-2 px-4 mt-8 mb-4 font-medium outline-none border border-gray-300" 
        placeholder="Add new item"
        v-model="newGroceryItem" 
        @keyup.enter="addNewGroceryItem"
        />
        <button class="block mt-4 text-gray-500 self-center md:hidden lg:hidden" @click="copyGroceriesToClipboard"><i class="i-ri-clipboard-line text-3xl"></i></button>
      </div>
    </div>
    <Accordion 
    v-if="groceryList" 
    :groceryList="groceryList"
    @edit-grocery-item="editGroceryListItem"
    @change-category="changeGroceryItemCategory"
    @delete-grocery-item="deleteGroceryItemById"
    />
    <div v-else>
      <p class="italic px-8">No items on your list yet.</p>
    </div>
  </div>
</template>
