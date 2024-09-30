<script lang="ts" setup>
import { GroceryItem } from '~/server/models/groceryList';
const emit = defineEmits(['change-grocery-item-category']);

const props = defineProps<{
  item: GroceryItem
}>()
const isLoading = ref(false);

const groups = ['flour', 'sweeteners', 'leaveners',  'fruits', 'spreads',  'diary',  'beverages',  'spices and seasonings',  'fats and oil'];
const filteredGroup = computed(() => {
  return groups.filter(group => group !== props.item.group);
});
</script>

<template>
  <form @submit.prevent="" class="p-4">
    <h1 class="text-xl font-medium">Pick Category</h1>
    <select className="select select-bordered my-8 w-full">
      <option disabled selected>{{ item.group }}</option>
      <option v-for="group in filteredGroup" :key="group">{{ group }}</option>
    </select>

    <div class="flex justify-end mt-4 mb-4">
      <i v-show="isLoading" class="loading loading-spinner"></i>
      <input :disabled="isLoading" type="submit" value="move" class="py-1.5 px-4 bg-[#0d0d0d] text-white uppercase rounded-sm"/>
    </div>
  </form>
</template>
