<script lang="ts" setup>
import ImageReveal from '~/components/ui/image-reveal.vue';
import FadeInAnimation from '~/components/ui/fade-in-animation.vue';
</script>

<template>
  <div class="px-4 text-center pt-4 md:pt-0 pb-16 bg-base-300 border-base-300 relative md:pb-0 md:max-w-5xl md:mx-auto lg:max-w-7xl">
    <div class="space-y-8 md:py-16 md:px-8">
      <FadeInAnimation>
        <h1 class="font-lora text-3xl font-semibold md:text-left md:w-96 md:pl-4 md:pb-8 lg:mx-32 lg:text-4xl">The home for all your recipes</h1>
      </FadeInAnimation>
      <FadeInAnimation>
        <div class="space-y-8 md:space-y-4 md:w-72 md:absolute md:bottom-16 md:right-12 lg:text-left lg:w-1/3 lg:right-32">
          <p class="font-lora text-md md:text-sm lg:text-xs">Save your favorite recipes in one place. Import just the recipe from any website without the distractions or clutter</p>
          <NuxtLink to="/login" class="inline-block border-b uppercase font-medium border-black tracking-wider">
            create an account
          </NuxtLink>
        </div>
      </FadeInAnimation>
      <div class="flex md:block gap-1 h-32 md:h-80 lg:px-16 md:mt-0 lg:mt-0">
        <ImageReveal imgClass="basis-1/3 md:absolute md:-top-20 md:right-12 md:w-72 md:h-[450px] lg:w-[450px] lg:right-28" :image-src="`https://images.pexels.com/photos/20009384/pexels-photo-20009384/free-photo-of-chocolate-cake-with-whipped-cream.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`"/>
        <ImageReveal imgClass="basis-2/3 md:w-80 lg:w-[500px]" :image-src="`https://images.pexels.com/photos/221083/pexels-photo-221083.jpeg?auto=compress&cs=tinysrgb&w=600`"/>
      </div>
    </div>
  </div>
</template>
