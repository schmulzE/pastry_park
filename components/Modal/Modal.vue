<script setup lang="ts">
import useModalStore from '../../stores/useModalStores'
const store = useModalStore();
defineProps(['text'])

</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition>
        <div 
        class="overlay" 
        @click.self="store.closeModal" 
        v-if="store.modalState?.component"  
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        >
          <div class="modals p-8 rounded-none w-screen max-w-6xl h-screen max-h-max bg-gray-200 text-gray-700">

            {{ text }}
            <button class="absolute top-0 right-4 text-gray-600" @click="store.closeModal">
              <i class="ri i-ri-close-line text-3xl"></i>
            </button>
              <component
                :is="store.modalState?.component"
                v-bind="store.modalState?.props" 
              />
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.modals {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .7);
  z-index: 999;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: 0.25s ease all;
}

</style>