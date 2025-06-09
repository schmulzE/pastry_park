<script lang="ts" setup>
import SignupForm from '~/components/auth/signup-form.vue';

definePageMeta({
	middleware: ["guest-only"],
});


async function onSignupSuccess() {
	await navigateTo("/login");
}
</script>

<template>
	<div class="bg-gray-200 flex justify-center items-center h-screen">
		<SignupForm @success="onSignupSuccess" />
	</div>
</template>
