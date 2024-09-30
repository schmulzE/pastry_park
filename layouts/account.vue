<script setup lang="ts">
const { signOut } = useAuth();
let category = ref('');

const form = reactive({
  pending: false,
});

async function onLogoutClick() {
  try {
    form.pending = true;
    await signOut();
    await navigateTo("/signup");
  } catch (error) {
    console.error(error);
  } finally {
    form.pending = false;
  }
};

onMounted(() => {
  const storedTab = localStorage.getItem('category');
  if (storedTab !== null) {
    category.value = storedTab.toLowerCase();
  };
});

</script>
<template>
  <div class="lg:flex overflow-hidden">
    <div class="lg:hidden">
      <slot name="tab"></slot>
    </div>
    <div class="bg-gray-900 text-gray-200 w-20 hidden lg:flex text-center flex-col justify-between py-5 sticky top-0 h-screen">
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
    <div class="bg-white lg:bg-gray-100 w-full lg:h-screen h-[530px] overflow-x-hidden overflow-y-auto break-words lg:px-48">
      <slot name="main"></slot>
    </div>
    <!-- footer -->
    <div class="bg-white fixed bottom-0 left-0 md:hidden w-full lg:hidden">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<style>
  
</style>