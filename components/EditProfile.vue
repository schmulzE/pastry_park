<script lang="ts" setup>
const emit = defineEmits(['update_user_profile', 'update_firstname', 'update_lastname']);

defineProps<{
  firstName: string,
  lastName: string,
}>();

const isLoading = ref(false);

const onSubmitProfile = async () => {
  try {
    isLoading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    emit('update_user_profile');

  } catch (error: any) {
    console.log('An error occured', error.message)
  }finally {
    isLoading.value = false;
  }
}

// Emit updates to the parent component
const updateFirstName = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_firstname', input.value);
};
const updateLastName = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update_lastname', input.value);
};

</script>

<template>
  <form class="p-4" @submit.prevent="onSubmitProfile">
    <h1 class="text-xl font-medium">Edit Profile</h1>
    <label class="form-control w-full mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">first name</span>
      </div>
      <input type="text" :value="firstName" @input="updateFirstName" name="item" class="outline-none border-b w-full" />
    </label>
    <label class="form-control w-full  mb-4">
      <div class="label px-0">
        <span class="label-text text-xs">last name</span>
      </div>
      <input type="text" :value="lastName"  @input="updateLastName" name="amount" class="outline-none border-b w-full" />
    </label>
    <div class="flex justify-end mt-8 mb-4 ">
      <button :disabled="isLoading" type="submit" class="py-1.5 flex gap-2 px-4 bg-[#0d0d0d] text-white rounded-sm uppercase">
        <i v-show="isLoading" class="loading loading-spinner"></i>
        save
      </button>
    </div>
  </form>
</template>
