<script lang="ts" setup>
import { Types } from 'mongoose';
import { IRecipe } from '~/types';

const route = useRoute();
const router = useRouter();
const currentTab = ref<number | null>(null);
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
  const tabs: { pastry: string; lists: { id?: Types.ObjectId; title: string; category: string;}[] }[] = [];

  pastries.forEach((pastry: string) => {
    const pastryData = data?.filter((item: { category: string; }) => item.category === pastry.toLowerCase());
    tabs.push({
      pastry: pastry,
      lists: pastryData?.map((item) =>({ id: item._id, title: item.title, category: item.category }))
    });
  });

  return tabs;
}


const selectTab = (index: number, name: string) => {
  currentTab.value = index;
  localStorage.setItem('currentTab', index.toString())
  localStorage.setItem('category', name);

  if (!isMobile) {
    const selectedTab = tabs[index];
    // Automatically navigate to the first item if it exists
    if (selectedTab.lists.length > 0) {
      const firstItem = selectedTab.lists[0];
      router.replace(`/browse/${firstItem.category}/${firstItem.title.replaceAll(' ', '-').toLowerCase()}/${firstItem.id}`);
    } else {
      router.replace(`/browse/${name.toLowerCase()}`);
    }
  } else {
    // On mobile, just navigate to the category page
    router.replace(`/browse/${name.toLowerCase()}`);
  }

}

// Function to handle incoming routes
const handleIncomingRoute = () => {
  const incomingCategory = route.params.pastry?.toString().toLowerCase();

  // Find the tab based on the incoming category
  const matchedTabIndex = tabs.findIndex(
    tab => tab.pastry.toLowerCase() === incomingCategory
  );

  if (matchedTabIndex !== -1) {
    currentTab.value = matchedTabIndex;

    // If there's a specific recipe in the URL, don't override it
    if (!route.params.recipe) {
      const selectedTab = tabs[matchedTabIndex];
      // Automatically navigate to the first item if it exists
      if (selectedTab.lists.length > 0) {
        const firstItem = selectedTab.lists[0];
        router.replace(`/browse/${firstItem.category}/${firstItem.title.replaceAll(' ', '-').toLowerCase()}/${firstItem.id}`);
      }
    }
  }
};

const nuxtApp = useNuxtApp();
const isMobile = nuxtApp.$isMobile;

onMounted(() => {
  // Handle initial page load (e.g., coming from another page)
  if(!isMobile){
    handleIncomingRoute();
  }

  const storedTab = localStorage.getItem('currentTab')
  if (storedTab !== null) {
    currentTab.value = parseInt(storedTab, 10)
  }
})

watch(route, () => {
  // Handle route changes when the user navigates to a new category
  if(!isMobile){
    handleIncomingRoute();
  }
});

const tabs = convertToTabs(pastries, props.recipes);

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


</script>

<template>
  <div class="flex flex-row w-full h-full font-sans">
    <div class="border-r border-gray-300 w-full md:w-36 lg:w-36 py-2 px-4 md:px-0 lg:px-0">
      <ul>
        <li 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="text-lg md:text-sm lg:text-sm p-2 flex justify-between hover:bg-gray-300 cursor-pointer border-b md:border-0 lg:border-0" 
        :class="currentTab === index && 'md:bg-gray-700 hover:text-white lg:bg-gray-700 md:text-white lg:text-white hover:bg-gray-700'"
        @click="selectTab(index, tab.pastry)"
        >
          <NuxtLink :to="`/browse/${tab.pastry}`">{{ tab.pastry }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="text-sm w-56 py-2 hidden md:block lg:block">
      <div class="dropdown w-full">
        <div tabindex="0" role="button" class="p-[8px] font-medium hover:bg-gray-300 border-b border-gray-300 flex items-center">
          Sort by A-Z 
          <i class="i-prime-sort-alt text-lg"></i>
        </div>
        <ul tabindex="0" class="dropdown-content z-[1] menu shadow bg-base-100 rounded-none w-full">
          <li><a @click="sortRecipes('alphabetical')">Alphabetical</a></li>
          <li><a @click="sortRecipes('recent')">Recent</a></li>
          <li><a @click="sortRecipes('rating')">Rating</a></li>
        </ul>
      </div>
      <div v-if='currentTab !== null'>
        <ul>
          <li v-for="(pastry, index) in tabs[currentTab].lists" :key="index">
            <NuxtLink 
            class="flex-1 w-full hover:bg-gray-300 p-2 inline-block font-sans" 
            :to="`/browse/${pastry.category}/${pastry.title.replaceAll(' ', '-').toLowerCase()}/${pastry.id}`"
            >
              <span class="capitalize">{{ pastry.title }}</span>
            </NuxtLink> 
          </li>
        </ul>
      </div>
      <NuxtLink 
      :to="`/${category}/add-recipe`" 
      class="p-2 text-lg hover:bg-gray-300 border-y border-gray-300 flex items-center mt-4 font-semibold capitalize"
      >
        add recipe
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-gray-700 text-white;
}
.router-link-active:hover {
  @apply bg-gray-700;
}
</style>