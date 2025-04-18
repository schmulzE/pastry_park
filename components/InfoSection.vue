<script lang="ts" setup>
defineProps<{
  title: string,
  description: string,
  imageOne: string,
  imageTwo: string,
}>()
</script>

<template>
  <div class="py-16 text-center relative font-lora px-4 md:py-0 lg:py-0 md:max-w-4xl md:mx-auto lg:max-w-7xl lg:h-[700px]">
    <div class="md:py-16 md:px-8 lg:h-full space-y-4">
      <FadeInAnimation>
        <h1 class="font-lora text-2xl font-medium md:text-left md:w-96 md:pl-4 md:pb-8 lg:mx-32 lg:text-4xl">{{ title }}</h1>
      </FadeInAnimation>
      <FadeInAnimation>
        <p class="font-lora text-md md:text-sm lg:absolute lg:bottom-28 lg:text-xs lg:text-left md:w-72 lg:w-1/3 lg:right-32">{{ description }}</p>
      </FadeInAnimation>
      <div class="flex md:block gap-1 h-32 md:h-80 lg:px-16 md:mt-0 lg:mt-0">
        <ImageReveal imgClass="basis-1/3 md:absolute md:top-4 md:right-12 md:w-72 md:h-[450px] lg:w-[450px] lg:right-28" :image-src="imageOne"/>
        <ImageReveal imgClass="basis-2/3 md:w-80 lg:w-[500px]" :image-src="imageTwo"/>
      </div>
    </div>
  </div>
</template>
