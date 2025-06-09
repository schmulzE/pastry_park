<script lang="ts" setup>
import { GroceryItem } from '~/server/models/groceryList';

const emit = defineEmits(['save_edited_item', 'update_item_keyword', 'update_item_quantity', 'update_item_unit', 'update_item_details']);
const props = defineProps<{
  item: GroceryItem
}>()

const isLoading = ref(false);

// Emit updates to the parent component
const updateItemKeyword = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_item_keyword', input.value);
};

const updateItemQuantity = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_item_quantity', input.value);
};

const updateItemUnit = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_item_unit', input.value);
};

const updateItemDetail = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_item_details', input.value);
};

const onSubmit = async() => {
  try {
    isLoading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    emit('save_edited_item');

  } catch (error: any) {
    console.log('An error occured', error.message)
  }finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <form class="p-4" @submit.prevent="onSubmit">
    <h1 class="text-xl font-medium">Edit Item</h1>
    <label class="form-control w-full mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">item</span>
      </div>
      <input type="text" :value="item.keyword" name="item" @input="updateItemKeyword" class="outline-none border-b w-full"/>
    </label>
    <label class="form-control w-full  mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">amount</span>
      </div>
      <input type="text" :value="item.quantity" @input="updateItemQuantity" name="amount" class="outline-none border-b w-full" />
    </label>
    <label class="form-control w-full  mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">unit</span>
      </div>
      <input type="text" :value="item.unit" @input="updateItemUnit" name="unit" class="outline-none border-b w-full" />
    </label>
    <label class="form-control w-full  mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">details</span>
      </div>
      <input type="text" :value="item.note" @input="updateItemDetail" name="unit" class="outline-none border-b w-full " />
    </label>
    <div class="flex justify-end mt-8 mb-4">
      <i v-show="isLoading" class="loading loading-spinner"></i>
      <input :disabled="isLoading" type="submit" value="save" class="py-1.5 px-4 bg-[#0d0d0d] text-white uppercase rounded-sm"/>
    </div>
  </form>
</template>