<script lang="ts" setup>
const emit = defineEmits(["success"]);

const { signIn } = useAuth();

const form = reactive({
  data: {
    name: "",
    password: "",
  },
  error: "",
  pending: false,
});

async function onLoginClick() {
  try {
    form.error = "";
    form.pending = true;
    
    await signIn("credentials", form.data);

    emit("success");
  } catch (error: any) {
    if (error.data.message) form.error = error.data.message;
  } finally {
    form.pending = false;
  }
}
</script>

<template>
  <form class="space-y-4 md:space-y-6 bg-white shadow-md w-full mx-4 md:mx-0 lg:mx-0 md:w-1/4 lg:w-1/4 p-4 rounded-md h-[500px]" @submit.prevent="onLoginClick">
    <div class="flex justify-center items-center text-4xl font-lora italic">pastry park</div>
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
