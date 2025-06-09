<script lang="ts" setup>
import useModalStore from '../../stores/modal';
const store = useModalStore();
defineProps<{ videoUrl: string }>()

const isLoading = ref(false);
const emit = defineEmits(['update_video_url', 'submit_video_url']);

const updateRecipeVideoUrl = (event: any) => {
  const input = event.target as HTMLInputElement;
  emit('update_video_url', input.value);
}

</script>

<template>
  <div class="flex flex-col items-start p-4">
    <div class="flex items-center w-full">
      <div class="text-gray-900 font-medium text-lg capitalize">paste youtube url</div>
        <svg  @click="store.closeModal()" class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
        </svg>
      </div>
      <hr>
      <label for="youtube_url" class="text-xs block">url</label>
      <input type="url" :value="videoUrl" id='youtube_url' @input="updateRecipeVideoUrl" class="py-3 w-full border-b outline-none border-gray-300"/>
      <hr>
      <div class="ml-auto space-x-4 mt-4">
        <button :disabled="isLoading" class="bg-[#0d0d0d] text-white font-bold py-2 px-4 rounded">
          <!-- <span v-show="isLoading" class="loading loading-spinner">spinner</span> -->
          submit
        </button>
        <button @click="store.closeModal()" type="button" class="bg-[#0d0d0d] text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          Close
        </button>
    </div>
  </div>
</template>
