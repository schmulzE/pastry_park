import { defineStore } from 'pinia'

export const useGroceryListStore = defineStore('groceryList', {
  state: () => ({
    items: [] as any
  }),
  actions: {
    addItem(item: any) {
      this.items.push(item)
    },
    removeItem(item: any) {
      this.items = this.items.filter((i: any) => i !== item)
    },
    clearList() {
      this.items = []
    }
  }
})