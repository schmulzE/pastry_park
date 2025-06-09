<template>
  <div class="fade-in-container" ref="containerRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'FadeInAnimation',
  props: {
    duration: {
      type: Number,
      default: 1
    },
    yOffset: {
      type: Number,
      default: 50
    },
    triggerOffset: {
      type: Number,
      default: 100
    }
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (containerRef.value) {
        const children = containerRef.value.children;
        
        Array.from(children).forEach((child) => {
          gsap.from(child, {
            opacity: 0,
            y: props.yOffset,
            duration: props.duration,
            scrollTrigger: {
              trigger: child,
              start: `top bottom-=${props.triggerOffset}`,
              toggleActions: 'play none none reverse'
            }
          });
        });
      }
    });

    return {
      containerRef
    };
  }
});
</script>

<style scoped>

</style>