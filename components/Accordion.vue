<template>
  <div class="w-full transition duration-500 ease-in-out delay-150 font-source">
    <div v-for="(items, group) in groupedItems" :key="group">
      <div 
      class="bg-gray-600 uppercase -z-40 px-8 py-3 flex justify-between items-center cursor-pointer text-lg font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-600" 
      :class="{ 'bg-gray-600 text-white': openGroups[group] }" 
      >
        <h3>{{ group }}</h3>
        <button @click="toggleAccordion(group)" class="flex content-center items-center">
          <i v-if="!openGroups[group]" class="i-ri-arrow-down-s-line text-xl"></i>
          <i v-else class="i-ri-arrow-up-s-line text-xl"></i>
        </button>
      </div>
      <div class="panel" v-show="openGroups[group]">
        <ul>
          <li class="py-2.5 px-8 flex justify-between items-center" v-for="(item, index) in items" :key="index">
            <a role="button" @click="toggleCompleted(item._id!)" :class="{ 'line-through text-gray-400 opacity-60' : item.completed }">
              <div class="text-gray-600 text-xl"><b class="text-slate-800 font-medium">{{  item.keyword }}</b> {{ parseVulgars(item.quantity!) }} {{ item.unit }}</div>
              <p class="text-gray-400 text-lg">{{ item.note }}</p>
            </a>
            <div class="dropdown dropdown-bottom dropdown-end hover:bg-transparent ">
              <i tabindex="0" role="button" class="i-ph-dots-three-vertical-bold text-4xl text-gray-400"></i>
              <ul tabindex="0" class="dropdown-content z-[99999] p-2 shadow bg-base-100 rounded-none w-52 text-sm">
                <li>
                  <a class="w-full flex p-1.5 rounded-sm hover:text-black hover:bg-base-300" role="button" @click="$emit('edit-grocery-item', item._id)">
                    Edit
                  </a>
                </li>
                <li>
                  <a class="w-full flex p-1.5 rounded-sm hover:text-black hover:bg-base-300" role="button" @click="$emit('change-category', item._id)">
                    Change Category
                  </a>
                </li>
                <li>
                  <a class="w-full flex p-1.5 rounded-sm hover:text-black hover:bg-base-300" role="button"  @click="deleteGroceryItemConfirmation(item._id!)">
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { parseVulgars } from 'vulgar-fractions';
import ModalInfo from '~/components/Modal/ModalInfo.vue';
import { GroceryItem, GroceryListDocument } from '~/server/models/groceryList';
import useModalStore from '~/stores/modal';


const store = useModalStore();
const openGroups = ref<Record<string, boolean>>({});
const props = defineProps<{ groceryList: GroceryListDocument }>();
const emit = defineEmits(['toggle-completed', 'edit-grocery-item', 'change-category', 'delete-grocery-item']);

// console.log('groceryList...', props.groceryList);
// Initialize openGroups with all groups closed;
props.groceryList.items.forEach((item: GroceryItem) => {
  if (!openGroups.value[item.group!]) {
    openGroups.value[item.group!] = true;
  }
});

const groupedItems = computed(() => {
  return props.groceryList.items.reduce((groups: { [key: string]: GroceryItem[] }, item: GroceryItem) => {
    const group = item.group || 'Uncategorized';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
});


const toggleAccordion = (group: string | number) => {
  openGroups.value[group] = !openGroups.value[group];
};

const toggleCompleted = async (itemId: string): Promise<void> => {

  const item = props.groceryList?.items.find(i => i._id === itemId);
  if (item) {
    item.completed = !item.completed;
    await $fetch(`/api/grocery-list/${itemId}`, {
      method: 'PATCH',
      body: { updates: { completed: item.completed } }
    });
  }
};

const deleteGroceryItemConfirmation = (itemId: string) => {
  store.openModal({
    component: markRaw(ModalInfo),
    props: {
      title: 'confirm',
      text: 'Are you sure you want to delete this grocery item?',
      buttonText: 'ok',
      cancelButtonText: 'cancel',
    },
    events: {
      modal_action: async () => {
        emit("delete-grocery-item", itemId)
        store.closeModal();
      },
      cancel_modal_action: async () => {
        store.closeModal();
      },
    },
  });
}

</script>

<style>

.panel {
  padding: 9px 18px;
  background-color: white;
  /* overflow: hidden; */
}
</style>