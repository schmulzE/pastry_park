<script lang="ts" setup>
import { useToast } from 'vue-toastification';

  const emit = defineEmits(['extract_recipe']);
  const toast =  useToast()

  const text = ref('');
  const isLoading = ref(false);

  const extractRecipeFromText = async() => {
    try {
      isLoading.value = true;
      emit('extract_recipe', text.value);

    } catch {
      throw new Error('An error occured. Please try again');
    }
  }
</script>

<template>
  <div class="flex flex-col items-start p-4">
    <div class="flex items-center w-full">
      <div class="font-medium text-lg mb-8">Paste text for a single recipe</div>
    </div>
    <hr>
    <label for="text" class="text-xs block">text</label>
    <textarea v-model="text" id='text' class=" py-2 w-full border-b outline-none border-gray-300 resize-none"></textarea>
    <hr>
    <div class="ml-auto space-x-4 mt-8">
      <button @click.prevent="extractRecipeFromText" :disabled="isLoading" class="bg-[#0D0D0D] hover:bg-[#252525] text-white font-medium py-2 px-4 rounded uppercase">
      <span v-show="isLoading" class="loading loading-spinner">spinner</span>
        import
      </button>
    </div>
  </div>
</template>
