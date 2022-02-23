export const state = () => ({
  dialog: false,
  data: [],
  group: {},
  editingGroup: false,
})

export const mutations = {
  setStatusDialog(state, status) {
    state.dialog = status
  },
  changeDataGroup(state, data) {
    state.data = data
  },
  setGroup(state, group) {
    state.group = group
  },
  setEditingGroup(state, editingGroup) {
    state.editingGroup = editingGroup
  },
}
