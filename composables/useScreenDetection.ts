import { ref, onMounted, onUnmounted } from 'vue'
import { RouteLocationRaw, useRouter } from 'vue-router'

export function useScreenDetection(mobileBreakpoint = 412) {
  const isMobile = ref(false)
  const isDesktop = ref(true)
  const router = useRouter()

  const checkScreen = () => {
    if (process.client) {
      isMobile.value = window.innerWidth < mobileBreakpoint
      isDesktop.value = !isMobile.value
    }
  }

  const redirectIfMobile = (route: RouteLocationRaw) => {
    if (process.client && isMobile.value && router.currentRoute.value.path !== route) {
      router.push(route)
    }
  }

  const redirectIfDesktop = (route: RouteLocationRaw) => {
    if (process.client && isDesktop.value && router.currentRoute.value.path !== route) {
      router.push(route)
    }
  }

  if (process.client) {
    onMounted(() => {
      checkScreen()
      window.addEventListener('resize', checkScreen)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreen)
    })
  }

  return { isMobile, isDesktop, redirectIfMobile, redirectIfDesktop }
}