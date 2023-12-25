<script lang="ts" setup>
definePageMeta({
    middleware: ["guest-only"],
});

const currentUser = useAuthUser();

async function onLoginSuccess() {
    await navigateTo("/browse");
}
</script>

<template>
    <div class="bg-gray-200 flex justify-center items-center h-screen">
        <FormLogin @success="onLoginSuccess" />
        <!-- <div class="mb-3 flex gap-3">
            <div>
                <p class="text-light-100">Try this user credentials:</p>
                <p class="text-light-100">
                    email: <code>user@gmail.com</code>
                    <br />
                    password: <code>password</code>
                </p>
            </div>
            <div>
                <p class="text-light-100">Try this admin credentials:</p>
                <p class="text-light-100">
                    email: <code>admin@gmail.com</code>
                    <br />
                    password: <code>password</code>
                </p>
            </div>
        </div> -->
        <!-- <PageUser :user="currentUser" /> -->
    </div>
</template>
