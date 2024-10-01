export default defineNuxtRouteMiddleware(async (to, from) => {
  const { status } = useAuth();
  const nuxtApp = useNuxtApp();
  const isMobile = nuxtApp.$isMobile;

  if (status.value === "authenticated" && process.client) {
    const category = localStorage.getItem('category')?.toLowerCase() || 'default-category';
    let targetPath = `/browse/${category}`;

    if (isMobile) {
      targetPath = '/browse';
    }


    if (to.path !== targetPath) {
      // Use setTimeout to delay the navigation slightly
      setTimeout(() => {
        navigateTo(targetPath, { replace: true });
      }, 500);

      // Return nothing to allow the initial navigation to complete
      return;
    }
  }
});