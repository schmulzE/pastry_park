<script lang="ts" setup>

</script>

<template>
  <NuxtLayout name="default">
    <template #main>
      <Navbar/>
      <HeroSection/>
      <InfoSection 
      title="Make recipes your own" 
      description="With pastry park recipe editor, you can easily edit recipes, save adjustments to ingredients, and add additional steps or tips to your preparation." 
      imageOne="https://images.pexels.com/photos/33715/cake-pops-pastries-cake-sweet.jpg?auto=compress&cs=tinysrgb&w=600" 
      imageTwo="https://images.pexels.com/photos/33715/cake-pops-pastries-cake-sweet.jpg?auto=compress&cs=tinysrgb&w=600"
      />
      <Features/>
      <InfoSection 
      title="Cook from your favorite device" 
      description="pastry park stores your recipes in the Cloud so you can access them on any device through our website."
      imageOne="https://images.pexels.com/photos/33715/cake-pops-pastries-cake-sweet.jpg?auto=compress&cs=tinysrgb&w=600" 
      imageTwo="https://images.pexels.com/photos/33715/cake-pops-pastries-cake-sweet.jpg?auto=compress&cs=tinysrgb&w=600"
      />
      <Footer/>
    </template>
  </NuxtLayout>
</template>
