<script lang="ts" setup>
definePageMeta({
	middleware: ["guest-only"],
});


async function onSignupSuccess() {
	await navigateTo("/login");
}
</script>

<template>
	<div class="bg-gray-200 flex justify-center items-center h-screen">
		<FormSignup @success="onSignupSuccess" />
	</div>
</template>
