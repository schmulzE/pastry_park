<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: ["guest-only"],
});

const category = ref('shortcrust');
const router = useRouter();

async function onLoginSuccess() {
  const targetPath = category.value ? `/browse/${category.value}` : '/browse/shortcrust';
  await router.push(targetPath);
}

onMounted(() => {
  const storedTab = localStorage.getItem('category');
  if (storedTab !== null) {
    category.value = storedTab.toLowerCase()
  }
})
</script>

<template>
	<div class="bg-gray-200 flex justify-center items-center h-screen">
		<FormLogin @success="onLoginSuccess" />
	</div>
</template>
