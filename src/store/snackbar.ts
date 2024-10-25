export enum SnackbarType {
  Success = 'success',
  Error = 'error',
}

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    isActive: false,
    type: SnackbarType.Success,
    message: '',
  }),

  actions: {
    setSnackbarStatus (isActive: typeof this.isActive, type?: typeof this.type) {
      this.isActive = isActive

      if (type) {
        this.type = type
      }
    },

    showSuccessSnackbar (message: typeof this.message) {
      this.message = message
      this.setSnackbarStatus(true, SnackbarType.Success)
    },

    showErrorSnackbar (message?: typeof this.message) {
      this.message = message ?? 'Ocorreu um erro! Por favor, tente novamente'
      this.setSnackbarStatus(true, SnackbarType.Error)
    },
  },
})
