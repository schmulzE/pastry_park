<script lang="ts" setup>
import { Types } from 'mongoose'; 
import { IRecipe } from '~/types';

let currentIndex = ref<number>(0);
const props = defineProps({
  recipes: {
    type: Array<IRecipe>,
    required: true
  },
  category: {
    type: String,
    required: false
  }
})

const pastries = [  
  'Shortcrust', 
  'Puff', 
  'Choux', 
  'Phyllo(Filo)', 
  'Sponge', 
  'Yeast-Risen',
  'Fried',
  'Savory',
  'Sweet',
  'Decorative',
  'Fritters',
  'Doughnuts',
  'Batttered'
]

function convertToTabs(pastries: string[], data: IRecipe[]) {
  const tabs: { 
    pastry: string; 
    lists: { id?: Types.ObjectId; title: string; category: string; image:string; description: string; rating?: number}[] 
  }[] = [];

  pastries.forEach((pastry: string) => {
    const pastryData = data?.filter((item: { category: string; }) => item.category === pastry.toLowerCase());
    tabs.push({
      pastry: pastry,
      lists: pastryData?.map((item) =>({ 
        id: item._id, 
        title: item.title, 
        category: item.category, 
        image: item.image, 
        description: item.description, 
        rating: item.rating
      })) || []
    });
  });

  return tabs;
}

const tabs = convertToTabs(pastries, props.recipes);

// Update currentIndex based on the category or default to 0
currentIndex.value = pastries.findIndex(pastry => pastry.toLowerCase() === props.category?.toLowerCase());
if (currentIndex.value === -1) {
  currentIndex.value = 0; // Default to first pastry if no matching category is found
}

// Computed property to filter recipes based on the selected filter;
const sortRecipes = (criteria: string) => {
  switch (criteria) {
    case 'alphabetical':
      return [...props.recipes].sort((a, b) => a.title.localeCompare(b.title));
    case 'recent':
      // return [...props.recipes].sort((a, b) => new Date(b.createdAt!) - new Date(a.createdAt!));
    case 'rating':
      return [...props.recipes].sort((a, b) => b.rating! - a.rating!);
    default:
      return props.recipes;
  }
};

const currentTab = computed(() => tabs[currentIndex.value] || { lists: [] });

</script>

<template>
  <div class="block mt-16 md:hidden lg:hidden">
    <div class="flex justify-between px-4 items-center">
      <h1 class="text-2xl capitalize font-medium">recipes</h1>
      <div class="dropdown">
        <div tabindex="0" role="button" class="p-[8px] flex items-center">
          Sort by A-Z 
          <i class="i-prime-sort-alt text-lg"></i>
        </div>
        <ul tabindex="0" class="dropdown-content z-[1] menu shadow bg-base-100 rounded-none w-full">
          <li><a @click="sortRecipes('alphabetical')">Alphabetical</a></li>
          <li><a @click="sortRecipes('recent')">Recent</a></li>
          <li><a @click="sortRecipes('rating')">Rating</a></li>
        </ul>
      </div>
    </div>
    <div>
      <ul v-if="currentTab.lists.length">
        <li v-for="(pastry, index) in currentTab.lists" :key="index">
          <NuxtLink 
          :to="`/browse/${pastry.category}/${pastry.title.replaceAll(' ', '-').toLowerCase()}/${pastry.id}`" 
          class="cursor-pointer flex gap-x-2"
          >
            <div 
            v-if="pastry.image" 
            class=" w-52 mx-4 bg-cover bg-center bg-no-repeat bg-gray-200 h-40 my-2" 
            :style="`background-image: url(${pastry.image}); min-height: 100px;min-width: 150px;`" 
            />
            <div>
              <h1 class="text-lg uppercase font-bold mb-1.5"> {{ pastry.title }}</h1>
              <p class="text-sm line-clamp-3">{{ pastry.description }}</p>
              <a v-if="pastry" class="inline-flex flex-row-reverse space-x-1" v-for="(star, index) in 5" :key="index">
                <span 
                class="i-ri-star-fill w-4 h-4 text-gray-300 cursor-default" 
                :class="{
                  'text-gray-300': index >= pastry.rating!,
                  'text-yellow-500': index < pastry.rating!,
                }"
                ></span>
              </a>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <p v-else class="text-center font-source text-lg py-4">No pastries available for this category.</p>
    </div>
  </div>
</template>
