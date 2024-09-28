<script setup lang="ts">
import useModalStore from '../../stores/modal';
const store = useModalStore();
defineProps(['text'])

</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition>
        <div 
        class="overlay bg-white/[0.6]" 
        @click.self="store.closeModal"
        v-if="store.modalState?.component"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        :class="store.modalState?.props!['overlayClass']"
        >
          <div
          :class="store.modalState?.props!['classes']"
          class="modals z-[1000] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] fixed"
          >
            {{ text }}
            <button class="absolute top-2 right-4 text-gray-400 font-bold" @click="store.closeModal">
              <i class="ri i-ri-close-line text-3xl"></i>
            </button>
              <component
                :is="store.modalState?.component"
                v-bind="store.modalState?.props" 
                v-on="store.modalState?.events"
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
  /* background-color: rgba(0, 0, 0, .7); */
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