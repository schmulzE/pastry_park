<template>
  <a class="hidden lg:inline-flex flex-row-reverse space-x-1 cursor-pointer" @click="rateStar(index + 1)" v-for="(star, index) in 5" :key="index">
    <span class="i-ri-star-fill w-8 h-8" :class="{
      'text-gray-300': index >= currentRating,
      'text-yellow-500': index < currentRating,
    }"></span>
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  currentRating: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['rating'])

const rateStar = (star: number) => {
  emit('rating', star)
}
</script>
