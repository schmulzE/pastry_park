export default defineNuxtPlugin((nuxtApp) => {
  const isMobile = process.server
    ? nuxtApp.ssrContext?.event.headers.get('user-agent')?.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      )
    : navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      );

  nuxtApp.provide('isMobile', !!isMobile);
});