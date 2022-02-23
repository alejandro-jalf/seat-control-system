export const state = () => ({
  width: 0,
  loading: false,
})

export const mutations = {
  setWidth(state, width) {
    state.width = width
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}
