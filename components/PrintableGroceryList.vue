<script lang="ts" setup>
import { parseVulgars } from 'vulgar-fractions';

interface GroceryItem {
  _id: string;
  quantity: number;
  unit: string;
  group: string;
  completed: boolean;
  keyword: string;
  note?: string;
}


interface GroceryList {
  _id: string;
  userId: string;
  items: GroceryItem[];
}


const props =  defineProps <{
  groceryList : GroceryList
}>();

console.log('groceryList:', props.groceryList);

const groupedItems = computed(() => {
  return props.groceryList.items.reduce((groups: any, item: any) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {});
});

</script>

<template>
  <div class="grocery-container">
    <div v-for="(items, group) in groupedItems" :key="group" class="category">
      <h3 class="category-title">{{ group }}</h3>
      <ul class="grocery-list">
        <li class="grocery-list-item" v-for="(item, index) in items" :key="index">
          <input type="checkbox" class="checkbox">
          <div class="grocery-item">
            <div>
              <span class="grocery-item-title">{{ item.title }}</span>
              <span class="grocery-item-amount">{{ parseVulgars(item.quantity) }} {{ item.unit }} {{  item.keyword }}</span>
            </div>
            <p v-if="item.note" class="grocery-item-note">{{ item.note }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
