<script setup lang="ts">
const { logout } = useAuth();

const form = reactive({
    pending: false,
});

async function onLogoutClick() {
  try {
    form.pending = true;
    await logout();
    await navigateTo("/signup");
  } catch (error) {
    console.error(error);
  } finally {
    form.pending = false;
  }
}
</script>
<template>
  <div class="lg:flex overflow-hidden">
    <div class="lg:hidden">
      <slot name="tab"></slot>
    </div>
    <div class="bg-gray-900 text-gray-200 w-28 hidden lg:flex text-center flex-col justify-between py-5 sticky top-0 h-screen">
      <div class="space-y-4">
        <NuxtLink to="/browse" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-book-3-line  text-2xl"></i>
        </NuxtLink>
        <NuxtLink to="/search" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-search-line text-2xl"></i>
        </NuxtLink>
        <NuxtLink to="/add-recipe" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-add-fill text-3xl"></i>
        </NuxtLink>
      </div>
      <div>
        <button @click.prevent="onLogoutClick" class="btn btn-ghost btn-circle">
          <i class="ri i-ri-logout-box-r-line text-2xl"></i>
        </button>

      </div>
    </div> 
    <!-- Sidebar  -->
    <div class="bg-gray-100 min-w-3xl w-[550px] border-r-2 border-gray-400 h-screen sticky top-0 hidden lg:block">
      <div class="border-b text-center p-10 text-3xl border-gray-400">Logo</div>
      <div class="pt-4 pb-28 overflow-y-auto h-[530px] relative">
        <slot name="sidebar"></slot>

      </div>
    </div>
    <div class="bg-white lg:bg-gray-100 w-full lg:h-screen h-[530px] overflow-x-hidden overflow-y-auto break-words lg:px-5">
      <slot name="main"></slot>
    </div>
  </div>
</template>
<style>
  
</style>
