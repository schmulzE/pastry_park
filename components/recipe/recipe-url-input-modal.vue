<script lang="ts" setup>
  const emit = defineEmits(['fetch_website_recipe']);
  const website = ref('');
  const isLoading = ref(false);

  const fetchDataFromUrl = async() => {
    try {
      isLoading.value = true;
      emit('fetch_website_recipe', website.value);

    } catch (error: any) {
      throw new Error('An error occured. Please try again');
    }
  }
</script>

<template>
  <div class="flex flex-col items-start p-4">
    <div class="flex items-center w-full">
      <div class="text-gray-900 font-medium text-lg">Paste URL to import recipe</div>
      </div>
      <hr>
    <label for="website" class="text-xs block">url</label>
    <input type="input" v-model="website" id='website' autocomplete="off" class="py-2 w-full border-b outline-none border-gray-300"/>
    <hr>
    <div class="ml-auto space-x-4 mt-4">
      <button @click.prevent="fetchDataFromUrl" :disabled="isLoading" class="bg-[#0D0D0D] hover:bg-[#252525] text-white font-medium py-2 px-4 rounded uppercase">
      <span v-show="isLoading" class="loading loading-spinner">spinner</span>
        import
      </button>
    </div>
  </div>
</template>
