<template>
  <div class="relative w-full overflow-hidden h-40 md:h-80" :class="imgClass" ref="imageContainer">
    <img :src="imageSrc" alt="Image of a pastry" class="w-full h-full object-cover" ref="image" />
    <div class="absolute top-0 left-0 w-full h-full origin-bottom bg-base-300" ref="overlay"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  imageSrc: string
  imgClass?: string
}>()

const imageContainer = ref<HTMLElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const overlay = ref<HTMLElement | null>(null)

onMounted(() => {
  if (imageContainer.value && image.value && overlay.value) {
    gsap.set(overlay.value, { scaleY: 1 })
    gsap.set(image.value, { scale: 1.2 })

    ScrollTrigger.create({
      trigger: imageContainer.value,
      start: 'top center',
      end: 'center center',
      scrub: true,
      onEnter: () => {
        gsap.to(overlay.value, { scaleY: 0, duration: 0.5, ease: 'power2.inOut' })
        gsap.to(image.value, { scale: 1, duration: 0.5, ease: 'power2.inOut' })
      },
      onLeaveBack: () => {
        gsap.to(overlay.value, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' })
        gsap.to(image.value, { scale: 1.2, duration: 0.5, ease: 'power2.inOut' })
      }
    })
  }
})
</script>

<style scoped>
.reveal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ddd;
  transform-origin: bottom;
}
</style>