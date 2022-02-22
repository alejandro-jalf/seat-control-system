export const state = () => ({
  dialog: false,
  chair: {},
})

export const mutations = {
  stateDialog(state, status) {
    state.dialog = status
  },
  changeChair(state, chair) {
    state.chair = chair
  },
}
