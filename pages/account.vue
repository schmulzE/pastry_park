<script lang="ts" setup>
// import JSZip from 'jszip';
const JSZip = (await import('jszip')).default
import { IRecipe } from '~/types';
// import { saveAs } from 'file-saver';
import useModalStore from '~/stores/modal';
import EditProfile from '~/components/user/edit-profile.vue';
import { useToast } from 'vue-toastification';
const { saveAs } = await import('file-saver')

const toast = useToast();
const route = useRoute();
const { data } = useAuth();
const store = useModalStore();
const isExporting = ref(false);
const category = ref<string | null>('');
const exportError = ref<string | null>(null);
let [ firstName, lastName ] = data.value?.user.name?.split(/\s+/) || [];

// Computed property to generate the full name
const fullName = computed(() => `${firstName} ${lastName}`);


function editProfileHandler () {
  store.openModal({ 
    component: markRaw(EditProfile), 
    props: {classes: "w-80 text-black rounded-none overflow-y-auto bg-base-100", firstName, lastName},
    events: {
      update_user_profile: async () => {
        await $fetch('/api/auth/update', {
          method: 'PATCH',
          body: { fullName }
        })
        store.closeModal();
      }, 
      update_firstname :(payload: string) => {
        firstName = payload;
      },
      update_lastname :(payload: string) => {
        lastName = payload;
      }
    }
  })
}

const exportRecipes = async () => {
  isExporting.value = true;
  exportError.value = null;

  try {
    // Fetch recipes from your API
    const response = await $fetch<IRecipe[]>('/recipe');
    const recipes = response;

    // Create a new zip file
    const zip = new JSZip();

    // Add each recipe to the zip file as a JSON file
    recipes.forEach((recipe) => {
      const fileName = `${recipe._id}_${recipe.title.replace(/\s+/g, '_')}.json`;
      const fileContent = JSON.stringify(recipe, null, 2);
      zip.file(fileName, fileContent);
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Trigger the download
    saveAs(content, 'my_recipes.zip');

    isExporting.value = false;
  } catch (error) {
    toast('An error occurred while exporting recipes. Please try again.', { toastClassName: "my-toast-class" });
    isExporting.value = false;
  }
};

onMounted(() => {
 category.value =  process.client  ? localStorage.getItem('category') : 'shortcrust'
})
</script>

<template>
  <NuxtLayout name="account">
    <template #tab>
      <div class="flex justify-between content-center font-sans p-4 bg-gray-100 items-center">
        <div></div>
        <h1 class="text-2xl font-medium capitalize">account</h1>
        <button class="capitalize text-xl" @click="">logout</button>
      </div>
    </template>
   <template #main>
    <div class="bg-white md:h-screen lg:h-screen relative lg:min-w-[634px] p-4 md:p-16 lg:p-24 font-source">
      <h1 class="text-2xl font-lora mb-4 capitalize">account information</h1>
      <div class="flex flex-col md:flex-row lg:flex-row justify-between content-center gap-4">
        <div class="border p-8 w-80 h-56">
          <hr class="text-black"/>
          <h1 class="text-lg">YOUR USER</h1>
          <h2 class="text-3xl font-lora italic">Profile</h2>
          <p class="text-base font-lora font-semibold my-5 capitalize"> {{ data?.user.name }}</p>
          <button @click="editProfileHandler" class="btn btn-outline w-full rounded-sm">edit profile</button>
        </div>
        <div class="border p-8 w-80 h-56">
          <hr class="text-black"/>
          <h1 class="text-lg">YOUR RECIPE</h1>
          <h2 class="text-3xl font-lora italic">Export</h2>
          <p class="text-base font-lora my-2">Generate a backup of all your recipes.</p>
          <button  @click="exportRecipes" :disabled="isExporting" class="btn btn-outline w-full flex gap-2 items-center rounded-sm">
            <i v-show="isExporting" class="loading loading-spinner"></i>
            export recipe
          </button>
        </div>
      </div>
    </div>
   </template>
   <template #footer>
    <div class="flex justify-between content-center px-2">
      <NuxtLink to="/browse" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-book-3-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/browse' }"></i>
      </NuxtLink>
      <NuxtLink to="/search" class="btn btn-ghost btn-circle" >
        <i class="ri i-ri-search-line text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path ==  '/search' }"></i>
      </NuxtLink>
      <NuxtLink :to="`/${category?.toLowerCase()}/add-recipe`" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-add-box-fill text-3xl bg-gray-400" :class="{ 'bg-gray-700': route.path == `${category}/add-recipe` }"></i>
      </NuxtLink>
      <NuxtLink to="/grocery-list" class="btn btn-ghost btn-circle">
        <i class="ri i-ri-shopping-cart-2-fill text-2xl bg-gray-400" :class="{ 'bg-gray-700': route.path == '/grocery-list' }"></i>
      </NuxtLink>
      <NuxtLink to="/account" class="btn btn-ghost btn-circle">
        <i class="i-ph-gear text-2xl bg-gray-400" :class="{ 'bg-gray-900': route.path == '/account' }"></i>
      </NuxtLink>
    </div>
   </template>
  </NuxtLayout>
</template>

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>