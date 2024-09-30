<script lang="ts" setup>
defineProps<{
  title: string,
  description: string,
  imageOne: string,
  imageTwo: string,
}>()
</script>

<template>
  <div class="py-16 text-center relative font-lora px-4 lg:py-0 md:max-w-5xl md:mx-auto lg:max-w-7xl lg:h-[700px]">
    <div class="md:border-x md:border-black md:py-16 md:px-8 lg:h-full space-y-4">
      <FadeInAnimation>
        <h1 class="font-lora text-2xl font-medium md:text-left md:w-96 md:pl-4 md:pb-8 lg:mx-32 lg:text-4xl">{{ title }}</h1>
      </FadeInAnimation>
      <FadeInAnimation>
        <p class="font-lora text-md md:text-sm lg:absolute lg:bottom-28 lg:text-xs lg:text-left lg:w-1/3 lg:right-44">{{ description }}</p>
      </FadeInAnimation>
      <div class="flex gap-1 h-32 relative md:block md:h-80 lg:px-16 lg:h-full">
        <ImageReveal imgClass="basis-1/3 md:absolute md:-top-28 md:right-14 lg:w-[500px]" :image-src="imageOne"/>
        <ImageReveal imgClass="basis-2/3 md:w-80 md:w-72 md:h-[450px] lg:w-[450px]" :image-src="imageTwo"/>
      </div>
    </div>
  </div>
</template>
