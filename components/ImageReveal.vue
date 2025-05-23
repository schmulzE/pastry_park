<template>
  <div class="relative w-full overflow-hidden h-40 md:h-80" :class="imgClass" ref="imageContainer">
    <img :src="imageSrc" alt="Image of a pastry" class="w-full h-full object-cover" ref="image" />
    <div class="absolute top-0 left-0 w-full h-full origin-bottom bg-base-300" ref="overlay"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const gsap = await import('gsap').then(m => m.gsap)
const { ScrollTrigger } = await import('gsap/ScrollTrigger')

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  imageSrc: string
  imgClass?: string
}>()

const imageContainer = ref<HTMLElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const overlay = ref<HTMLElement | null>(null)
let scrollTrigger: ScrollTrigger | null = null

const setupAnimation = () => {
  // Kill existing ScrollTrigger if it exists
  if (scrollTrigger) {
    scrollTrigger.kill()
  }

  if (imageContainer.value && image.value && overlay.value) {
    scrollTrigger = ScrollTrigger.create({
      trigger: imageContainer.value,
      start: 'top 80%', // Adjusted for better mobile behavior
      end: 'top 30%',   // Adjusted for better mobile behavior
      once: true,
      onEnter: () => {
        gsap.to(overlay.value, { scaleY: 0, duration: 0.5, ease: 'power2.inOut' })
        gsap.to(image.value, { scale: 1, duration: 0.5, ease: 'power2.inOut' })
      },
      onLeaveBack: () => {
        gsap.to(overlay.value, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' })
        gsap.to(image.value, { scale: 1.2, duration: 0.5, ease: 'power2.inOut' })
      },
      markers: false // Set to true for debugging, then false for production
    })
  }
}

onMounted(() => {
  if (imageContainer.value && image.value && overlay.value) {
    gsap.set(overlay.value, { scaleY: 1 })
    gsap.set(image.value, { scale: 1.2 })

    setupAnimation()

    // Refresh ScrollTrigger on resize to account for mobile/desktop changes
    window.addEventListener('resize', setupAnimation)
  }
})

onUnmounted(() => {
  if (scrollTrigger) {
    scrollTrigger.kill()
  }
  window.removeEventListener('resize', setupAnimation)
})
</script>