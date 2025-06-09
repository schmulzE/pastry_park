<script setup lang="ts">
import { useToast } from 'vue-toastification';

const { signOut } = useAuth();
const router = useRouter();
let category = ref('');
const toast = useToast();

async function onLogoutClick() {
  try {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    })
  } catch (error) {
    toast("Failed to log out. Please try again.", { toastClassName: "my-toast-class" });
  }finally {
    await router.push("/login")
  }
}

onMounted(() => {
  const storedTab = localStorage.getItem('category')
  if (storedTab !== null) {
    category.value = storedTab.toLowerCase()
  }
})

</script>
<template>
  <div class="lg:flex md:flex overflow-hidden md:overflow-hidden">
    <div class="fixed top-0 right-0 w-full z-20 lg:hidden md:hidden">
      <slot name="tab"></slot>
    </div>
    <div class="bg-gray-900 text-gray-200 w-28 hidden md:flex lg:flex text-center flex-col justify-between py-5 sticky top-0 md:sticky md:top-0 md:h-screen h-screen">
      <div class="space-y-4">
        <NuxtLink :to= "`/browse/${category}`" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-book-3-line  text-2xl"></i>
        </NuxtLink>
        <NuxtLink to="/search" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-search-line text-2xl"></i>
        </NuxtLink>
        <NuxtLink to="/grocery-list" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-shopping-cart-2-fill text-3xl"></i>
        </NuxtLink>
        <NuxtLink to="/account" class="btn btn-ghost btn-circle">
          <i class="i-ph-gear text-3xl"></i>
        </NuxtLink>
      </div>
      <div>
        <button @click.prevent="onLogoutClick" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-logout-box-r-line text-2xl"></i>
        </button>

      </div>
    </div> 
    <!-- Sidebar  -->
    <div class="bg-gray-100 min-w-3xl w-[550px] md:w-[500px] lg:w-[550px] border-r-2 border-gray-300 h-screen sticky top-0 hidden md:block lg:block">
      <div class="border-b text-center p-10 border-gray-300 italic font-lora">
        <div class="flex items-center justify-center space-x-1">
          <i class="ph i-ph-chef-hat text-4xl"></i>
          <span class="text-3xl">pastrypark</span>
        </div>
      </div>
      <slot name="sidebar"></slot>
    </div>
    <!-- main view -->
    <div class="bg-white h-auto md:bg-gray-100 md:h-screen lg:bg-gray-100 w-full lg:h-screen overflow-x-hidden overflow-y-auto break-words lg:px-12 md:px-4">
      <slot name="main"></slot>
    </div>
    <!-- footer -->
    <div class="bg-white fixed bottom-0 left-0 md:hidden w-full lg:hidden">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>