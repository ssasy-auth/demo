import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    visible: false
  }),
  actions: {
    toggle() {
      this.visible = !this.visible
    }
  }
})

export const useExtensionStore = defineStore('extension', () => {
  const installed = ref(false)

  return {
    installed
  }
});