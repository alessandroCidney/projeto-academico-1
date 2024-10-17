export const useMainStore = defineStore('main', {
  state: () => ({
    loadingAuthPlugin: true,
  }),

  actions: {
    setLoadingAuthPlugin (value: typeof this.loadingAuthPlugin) {
      this.loadingAuthPlugin = value
    },
  },
})
