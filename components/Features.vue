<script lang="ts" setup>
</script>

<template>
  <div class="py-8 text-center font-lora px-4 space-y-4 lg:px-36 bg-base-200 lg:py-16">
    <div class="flex flex-col lg:flex-row lg:items-center lg:gap-x-4 lg:justify-center lg:content-center bg-base-300 p-2">
      <h2 class="inline-block text-4xl capitalize font-light text-blue-600 font-mulish">add recipes</h2> <p class="text-lg align-bottom">Import from websites or enter them using our side-by-side recipe form.</p>
    </div>
    <div class="rounded-md shadow-[0_2px_4px_0_rgba(0,0,0,0.50)]">
      <video ref="videoElement" autoplay loop muted playsinline class="w-full h-full rounded-md">
          <source src="/videos/export-recipe-video.mp4" type="video/mp4">
          Your browser does not support the video tag.
      </video>
    </div>
  </div>
  <div class="py-8 text-center font-lora px-4 space-y-4 lg:px-36 bg-base-200 lg:py-16">
    <div class="flex flex-col bg-base-300 p-2 lg:flex-row lg:items-center lg:gap-x-4 lg:justify-center lg:content-center">
      <h2 class="inline-block text-4xl capitalize font-light text-blue-600 font-mulish">organize recipes</h2> <p class="text-lg">Arranged into pastry categories.</p>
    </div>
    <div class="rounded-md shadow-[0_2px_4px_0_rgba(0,0,0,0.50)]">
      <video ref="videoElement" autoplay loop muted playsinline class="w-full h-full rounded-md">
          <source src="/videos/organize-recipe-video.mp4" type="video/mp4">
          Your browser does not support the video tag.
      </video>
    </div>
  </div>
  <div class="py-8 text-center font-lora px-4 space-y-4 lg:px-36 bg-base-200 lg:py-16">
    <div class="flex flex-col bg-base-300 p-2 lg:flex-row lg:items-center lg:gap-x-4 lg:justify-center lg:content-center">
      <h2 class="inline-block text-4xl capitalize font-light text-blue-600 font-mulish">find recipes</h2> <p class="text-lg">Search your collection by title, ingredient, and/or author.</p>
    </div>
    <div class="rounded-md shadow-[0_2px_4px_0_rgba(0,0,0,0.50)]">
      <video ref="videoElement" autoplay loop muted playsinline class="rounded-md w-full h-full">
          <source src="/videos/search-recipe-video.mp4" type="video/mp4">
          Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>
