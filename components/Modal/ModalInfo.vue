<script lang="ts" setup>
import { useToast } from "vue-toastification";

const toast = useToast();
const loading = ref(false);
const emit = defineEmits(['modal_action', 'cancel_modal_action']);
const inputRef = ref<HTMLInputElement | null>(null);

interface SharedLink {
  _id: string;
  url: string;
  recipeId: string;
  createdBy: string;
}

const props = defineProps<{
  link?: SharedLink;
  title: string;
  text: string;
  buttonText: string;
  cancelButtonText: string;
}>();

const modalActionHandler = async () => {
  try {
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 2000));
    emit('modal_action');
    
  } catch (error: any) {
    toast("Error fetching recipe metadata. Please try again.", { toastClassName: "my-toast-class" });
  }finally {
    loading.value = false;
  }
}

const copyLinkToClipboard = () => {
    // Check if the clipboard API is supported
    if (navigator.clipboard) {
      navigator.clipboard.writeText(props.link?.url!).then(
        () => {
          toast('Text copied to clipboard', { toastClassName: "my-toast-class" });
        },
        (err) => {
          toast('Failed to copy text', { toastClassName: "my-toast-class" });
        }
      );
    } else {
      // Fallback for browsers that do not support the Clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = props.link?.url as string;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast('Text copied to clipboard', { toastClassName: "my-toast-class" });
    }
  } 

  onMounted(() => {
  // Focus the textarea when the component is mounted
  if (inputRef.value) {
    inputRef.value.focus()
    inputRef.value.select()
  }
})

const closeModalAction = () => {
  emit('cancel_modal_action')
}

</script>

<template>
  <div class="w-96 bg-base-100 p-4 rounded-md shadow-xl">
    <h1 class="font-semibold text-xl capitalize my-4">{{ title }}</h1>
    <p class="text-sm">{{ text }}</p>
    <div v-show="link" class="grid grid-cols-4 my-4">
      <input class="col-span-3 p-1 border" readonly ref="inputRef" :value="link?.url"/>
      <button class="border uppercase text-xs font-semibold col-span-1 p-1" @click="copyLinkToClipboard">copy link</button>
    </div>
    <div class="flex justify-end gap-2 mt-12">
      <button
      v-show="cancelButtonText"
      class="uppercase hover:bg-gray-700 flex items-center gap-x-1.5 border-gray-700 border text-sm hover:text-slate-50 p-2 text-gray-700 font-medium rounded-sm " 
      @click="closeModalAction">
        {{ cancelButtonText }}
      </button>
      <button 
      class="uppercase bg-gray-800 flex items-center gap-x-1.5 text-sm px-8 hover:bg-gray-900 p-2 text-slate-50 font-medium rounded-sm" 
      @click="modalActionHandler">
        <span v-show="loading" class="loading loading-spinner"></span>
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>