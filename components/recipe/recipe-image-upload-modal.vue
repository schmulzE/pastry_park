<script lang="ts" setup>
const emit = defineEmits(['update_recipe_image']);
const imageFile = ref(null)
const inputRef = ref<HTMLInputElement>()


const onChange = (e :any) => {
  displayFile(e.target.files[0])
}

const displayFile = (item: Blob) => {
  const file = item;
  const fileReader = new FileReader();
  fileReader.addEventListener("load", (e) => {
    emit('update_recipe_image', e.target!.result);
  });

  fileReader.readAsDataURL(file);
}

const drop = (event :any) => {
  event.preventDefault();
  displayFile(event.dataTransfer.files[0]); // Trigger the onChange event manually
}

const paste = (event :any) => {
  event.preventDefault();
  displayFile(event.dataTransfer.files[0]); // Trigger the onChange event manually
}

const openInput = () => {
  inputRef.value!.click()
}
</script>

<template>
  <div>
    <div class="flex flex-col items-start p-4">
      <div class="flex items-center w-full">
        <svg  class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
        </svg>
      </div>
      <div
        style="border: 1px dashed black"
        class="p-14 flex text-center justify-center content-center w-full"
        ref="draggable-div"
        @paste.prevent="paste($event)"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.prevent
        @drop.prevent="drop($event)"
        >
          <input
          type="file"
          name="file"
          ref="file"
          @change="onChange"
          class="inputfile h-1 w-1 opacity-0 absolute z-0"
          id="file"
          accept=".pdf,.jpg,.png,.jpeg,"
          />
          <label for="file">
            <span v-if="!imageFile" class="i-mdi-file-image-box text-7xl"></span>
            <img v-else :src="imageFile"  />
            <div class="ml-7 text-md">Select Image to Upload</div>
            <div>or Drag and Drop, Copy and Paste an Image</div>
          </label>
        </div>
    </div>
    <button @click="openInput" class="lg:hidden btn btn-outline rounded-none btn-sm hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 border-gray-300 text-gray-600 w-32" type="button">image</button>
    <input
    type="file"
    name="file"
    ref="inputRef"
    @change="onChange"
    class="inputfile h-1 w-1 opacity-0 absolute"
    id="file"
    accept=".pdf,.jpg,.png,.jpeg,"
    />
  </div>
</template>
