<script lang="ts" setup>
import Footer from "~/components/home/footer.vue";
import Navbar from "~/components/home/navbar.vue";
import Features from "~/components/home/features.vue";
import InfoSection from "~/components/home/info-section.vue";
import HeroSection from "~/components/home/hero-section.vue";
import CallToAction from "~/components/home/call-to-action.vue";
</script>

<template>
  <NuxtLayout name="default">
    <template #main>
      <Navbar/>
      <HeroSection/>
      <Features/>
      <InfoSection 
      title="Make recipes your own" 
      description="With pastry park recipe editor, you can easily edit recipes, save adjustments to ingredients, and add additional steps or tips to your preparation." 
      imageOne="https://images.pexels.com/photos/1893560/pexels-photo-1893560.jpeg?auto=compress&cs=tinysrgb&w=600" 
      imageTwo="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600"
      />
      <CallToAction/>
      <Footer/>
    </template>
  </NuxtLayout>
</template>
