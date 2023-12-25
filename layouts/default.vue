<script lang="ts" setup>
const currentUser = useAuthUser();
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
    <div class="min-h-screen flex flex-col bg-slate-700 text-gray-200">
        <header class="p-3 mx-auto w-full max-w-4xl">
            <nav class="flex gap-3">
                <PageLink to="/"> Home </PageLink>

                <template v-if="currentUser">
                    <PageLink to="/private"> Private </PageLink>


                    <button
                        class="mb-3 ml-auto py-1 px-2 rounded bg-light-100 hover:bg-light-700 transition-colors"
                        :disabled="form.pending"
                        @click="onLogoutClick"
                    >
                        Logout
                    </button>
                </template>

                <template v-else>
                    <PageLink to="/guest"> Public </PageLink>

                    <NuxtLink
                        to="/login"
                        class="ml-auto py-1 px-2 rounded bg-light-100 hover:bg-light-700 transition-colors"
                    >
                        Login
                    </NuxtLink>
                </template>
            </nav>
        </header>

        <main class="p-3 mx-auto w-full max-w-4xl">
            <slot />
        </main>
    </div>
</template>
