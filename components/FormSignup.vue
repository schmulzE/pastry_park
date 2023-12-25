<script lang="ts" setup>
const emit = defineEmits(["success"]);

const { signup } = useAuth();

const form = reactive({
    data: {
        email: "",
        password: "",
        username: "",
    },
    error: "",
    pending: false,
});

async function onSignupClick() {
    try {
        form.error = "";
        form.pending = true;

        await signup(form.data.email, form.data.password, form.data.username);

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
    <!-- <form class="mb-3 flex flex-wrap gap-3" @submit.prevent="onSignupClick">
        <input v-model="form.data.username" type="text" placeholder="username" required />
        <input v-model="form.data.email" type="email" placeholder="Email" required />
        <input v-model="form.data.password" type="password" placeholder="Password" required />
        <button
            type="submit"
            :disabled="form.pending"
            class="py-1 px-2 rounded bg-light-100 hover:bg-light-700 transition-colors"
        >
            Signup
        </button>
    </form> -->

  <form class="space-y-4 md:space-y-6 bg-white shadow-md w-1/4 p-4 rounded-md h-[500px]" @submit.prevent = "onSignupClick">
      <div class="flex justify-center items-center capitalize text-4xl">logo</div>
      <div>
        <label
          for="username"
          class="block mb-2 text-xs"
          >Name</label
        >
        <input
          type="text"
          v-model="form.data.username"
          id="username"
          class="focus:outline-none w-full border-gray-300 bg-white border-b py-2"
          required
        />

      </div>
      <div>
        <label
          for="email"
          class="block mb-2 text-xs"
          >Email</label
        >
        <input
          type="email"
          v-model="form.data.email"
          id="email"
          class="focus:outline-none w-full border-gray-300 bg-white border-b py-2"
          placeholder="name@company.com"
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