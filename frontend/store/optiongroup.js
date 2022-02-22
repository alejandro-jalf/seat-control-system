export const state = () => ({
  dialog: false,
  data: {},
})

export const mutations = {
  setStatusDialog(state, status) {
    state.dialog = status
  },
  changeDataGroup(state, data) {
    state.data = data
  },
}
