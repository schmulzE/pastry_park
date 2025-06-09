<script lang="ts" setup>
const emit = defineEmits(["success"]);

const form = reactive({
    data: {
      email: "",
      password: "",
      name: "",
    },
    error: "",
    pending: false,
});

async function onSignupClick() {
  try {
    form.error = "";
    form.pending = true;

    await useFetch("/api/auth/register", {
    method: "POST",
    body: form.data,
  });

    emit("success");
  } catch (error: any) {
    console.error(error);

    if (error.data.message) form.error = error.data.message;
  } finally {
      form.pending = false;
  }
}
</script>

<template>
  <p v-if="form.error" class="mb-3 text-red-500">
    {{ form.error }}
  </p>
  <form class="space-y-4 md:space-y-6 bg-white shadow-md w-1/4 p-4 rounded-md h-[500px]" @submit.prevent = "onSignupClick">
      <div class="flex justify-center items-center text-3xl">
        <div class="flex items-center mb-4 md:mb-0">
          <i class="ph i-ph-chef-hat"></i>
          <span class="font-light italic font-lora">pastrypark</span>
        </div>
      </div>
      <div>
        <label
        for="name"
        class="block mb-2 text-xs"
        >
         Name
        </label
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
        for="email"
        class="block mb-2 text-xs"
        >
          Email
        </label
        >
        <input
          type="email"
          v-model="form.data.email"
          id="email"
          class="focus:outline-none w-full border-gray-300 bg-white border-b py-2"
          placeholder="name@company.com"
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
        placeholder="••••••••" 
        required 
        type="password" 
        />
      </div>
      <div class="flex justify-center items-center">
        <button
        :disabled="form.pending"
        type="submit"
        class="bg-gray-400 hover:bg-gray-600 w-1/2 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center uppercase"
        >
        Sign in
      </button>
    </div>
    <p class="text-sm font-light text-gray-500 ">
      Already have an account?
      <NuxtLink
        to="/login"
        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >Login in
      </NuxtLink>
    </p>
  </form>
</template>