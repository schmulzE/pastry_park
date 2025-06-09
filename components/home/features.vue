<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref<Record<string, boolean>>({})
const observerRef = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observerRef.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = {
            ...isVisible.value,
            [entry.target.id]: true,
          }
        }
      })
    },
    { threshold: 0.2 },
  )

  const elements = document.querySelectorAll("[data-animate]")
  elements.forEach((el) => observerRef.value?.observe(el))
});

onUnmounted(() => {
  observerRef.value?.disconnect()
});
</script>

<template>
    <section id="features" class="py-20 bg-gray-50 font-lora px-4 md:px-16 lg:px-32">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-4">Everything You Need to Bake</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Four powerful features designed to transform your pastry journey
          </p>
        </div>

        <!-- Feature 1: Search -->
        <div class="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div
            id="search-feature"
            data-animate
            :class="`transform transition-all duration-1000 ${
              isVisible['search-feature'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`"
          >
            <div class="flex items-center mb-4">
              <i class="h-8 w-8 i-ri-search-line text-gray-900 mr-3" />
              <h3 class="text-2xl font-light text-gray-900">Intelligent Search</h3>
            </div>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Find the perfect pastry recipe with our advanced search engine. Filter by ingredients, difficulty,
              baking time, or dietary preferences to discover your next masterpiece.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li>• Search by ingredients you have</li>
              <li>• Filter by skill level and time</li>
              <li>• Dietary restriction support</li>
            </ul>
          </div>
          <div
            :class="`transform transition-all duration-1000 delay-300 ${
              isVisible['search-feature']
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-10 opacity-0 scale-95'
            }`"
          >
            <div class="relative overflow-hidden rounded-lg shadow-lg h-40 md:h-80 lg:h-80">
              <video ref="videoElement" autoplay loop muted playsinline class="w-full h-full object-fill">
                <source src="https://res.cloudinary.com/dmjdjqpyp/video/upload/v1736523044/search_recipe_ejztzt.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        <!-- Feature 2: Grocery List -->
        <div class="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div
            :class="`transform transition-all duration-1000 delay-200 md:order-2 ${
              isVisible['grocery-feature']
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-10 opacity-0 scale-95'
            }`"
          >
            <div class="relative overflow-hidden rounded-lg shadow-lg h-40 md:h-80 lg:h-80">
              <video ref="videoElement" autoplay loop muted playsinline class="w-full h-full object-fill">
                <source src="https://res.cloudinary.com/dmjdjqpyp/video/upload/v1736522883/smart_grocery_list_tdoose.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div
            id="grocery-feature"
            data-animate
            :class="`transform transition-all duration-1000 md:order-1 ${
              isVisible['grocery-feature'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`"
          >
            <div class="flex items-center mb-4">
              <i class="h-8 w-8 text-gray-900 i-ph-shopping-cart mr-3" />
              <h3 class="text-2xl font-light text-gray-900">Smart Grocery Lists</h3>
            </div>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Automatically generate organized shopping lists from your selected recipes. Combine multiple recipes,
              adjust serving sizes, and never forget an ingredient again.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li>• Automatic ingredient consolidation</li>
              <li>• Serving size adjustments</li>
              <li>• Organized by store sections</li>
            </ul>
          </div>
        </div>

        <!-- Feature 3: Recipe Extraction -->
        <div class="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div
            id="extraction-feature"
            data-animate
            :class="`transform transition-all duration-1000 ${
              isVisible['extraction-feature'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`"
          >
            <div class="flex items-center mb-4">
              <i class="h-8 w-8 text-gray-900 i-ph-globe mr-3" />
              <h3 class="text-2xl font-light text-gray-900">Recipe Extraction</h3>
            </div>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Import recipes from any website or extract them from text with our intelligent parsing technology. Build
              your collection effortlessly from your favorite food blogs and cookbooks.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li>• Extract from any recipe website</li>
              <li>• Parse text and images</li>
              <li>• Automatic formatting and organization</li>
            </ul>
          </div>
          <div
            :class="`transform transition-all duration-1000 delay-300 ${
              isVisible['extraction-feature']
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-10 opacity-0 scale-95'
            }`"
          >
            <div class="relative overflow-hidden rounded-lg shadow-lg h-40 md:h-80 lg:h-80">
              <video ref="videoElement" autoplay loop muted playsinline class="w-full h-full object-fill">
                <source src="https://res.cloudinary.com/dmjdjqpyp/video/upload/v1736523044/import_recipe_pwwghk.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>
