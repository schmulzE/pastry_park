<script lang="ts" setup>
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="relative overflow-hidden">
    <div class="navbar bg-base-300 px-4 lg:px-12">
      <div class="flex-1 md:flex-none">
        <NuxtLink to="/" class="text-2xl font-lora italic lowercase px-0">pastry park</NuxtLink>
      </div>
      <div class="navbar-end md:navbar-start lg:ml-12">
        <ul class="px-1 text-sm hidden md:flex md:gap-4 font-mulish">
          <li 
          class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          >
          <NuxtLink  to="/#">Contact</NuxtLink>
          </li>
          <li
          class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          ><NuxtLink to="/login">Sign in</NuxtLink></li>
          <li
          class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          ><NuxtLink to="/register">Sign up</NuxtLink></li>
        </ul>
        <button class="lg:hidden md:hidden" @click="toggleMenu">
          <i class="ri i-ri-menu-line text-3xl"></i>
        </button>
      </div>
    </div>
    <div v-show="isMenuOpen" class="bg-slate-400 z-[9999] overflow-hidden fixed top-0 left-0 w-full h-screen">
      <button class="absolute top-4 right-2 text-base-100"  @click="toggleMenu">
        <i class="ri i-ri-close-fill text-3xl"></i>
      </button>
      <div class="text-center text-base-100 flex flex-col justify-center items-center content-center h-3/4">
        <div class="mb-16">
          <a class="btn btn-ghost text-4xl font-lora italic lowercase">pastry park</a>
        </div>
        <ul class="space-y-8 font-mulish uppercase text-center w-full">
          <li class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          >
            <NuxtLink>Contact</NuxtLink>
          </li>
          <li 
          class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          >
            <NuxtLink to="/login">Sign in</NuxtLink>
          </li>
          <li 
          class="relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
          >
            <NuxtLink to="/register">Sign up</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="hidden md:block h-full w-[1px] bg-gray-800 absolute top-0 md:right-4 lg:right-[50px]"></div>
</template>


<style>
.menu {
  position: fixed;
  z-index: 1000;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}
</style>