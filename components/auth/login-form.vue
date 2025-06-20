<script lang="ts" setup>
import { useToast } from 'vue-toastification';

const emit = defineEmits(["success"]);
const { signIn } = useAuth();
const toast = useToast();

const form = reactive({
  data: {
    name: "",
    password: "",
  },
  pending: false,
});

async function onLogin() {
  try {
    form.pending = true;
    const result = await signIn('credentials', {
      name: form.data.name,
      password: form.data.password,
      redirect: false // Important: prevent default redirect to handle errors
    })

    if (result?.error) {
      // Handle specific error cases
      if (result.error === 'CredentialsSignin') {
        toast("Invalid mail or password", { toastClassName: "my-toast-class" });
      } else {
        toast("Login failed. Please try again", { toastClassName: "my-toast-class" });
      }
      return
    }

    emit("success");
  } catch (error) {
    toast("An unexpected error occured", { toastClassName: "my-toast-class" });
  }finally {
    form.pending = false
  }
}

</script>

<template>
  <form class="space-y-4 md:space-y-6 bg-white shadow-md w-full mx-4 md:mx-0 lg:mx-0 md:w-1/4 lg:w-1/4 p-4 rounded-md h-[500px]" @submit.prevent="onLogin">
    <div class="flex justify-center items-center text-3xl font-lora italic">
       <div class="flex items-center mb-4 md:mb-0">
          <i class="ph i-ph-chef-hat"></i>
          <span class="font-light italic">pastrypark</span>
        </div>
    </div>
    <div>
      <label
        for="name"
        class="block mb-2 text-xs "
        >Name</label
      >
      <input
        type="text"
        v-model="form.data.name"
        id="name"
        class="focus:outline-none w-full border-gray-300 bg-white border-b py-2"
        autocomplete="false"
        required
      />

    </div>
    <div>
      <label
        for="password"
        class="block mb-2 text-xs"
        >Password</label
      >
      <input 
      class="focus:outline-none w-full border-gray-300 bg-white border-b py-2"  
      v-model="form.data.password" 
      id="password"  
      autocomplete="true"
      required 
      type="password" 
      />
    </div>
    <div class="flex justify-center items-center">
      <button
      :disabled="form.pending"
      type="submit"
      class="bg-gray-400 flex items-center justify-center disabled:bg-gray-300 gap-x-2 hover:bg-gray-600 w-1/2 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center uppercase"
      >
      <i v-show="form.pending" class="loading loading-spinner"></i>
        Sign in
      </button>
    </div>
    <p class="text-sm font-light text-gray-500 ">
      Don’t have an account yet?
      <NuxtLink
        to="/signup"
        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >Sign up
      </NuxtLink>
    </p>
  </form>
</template>

<style>
/* When setting CSS, remember that priority increases with specificity, so don't forget to select the existing classes as well */
.Vue-Toastification__toast--default.my-toast-class {
  background-color: #a67c00;
}

</style>