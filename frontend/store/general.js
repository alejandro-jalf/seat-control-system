if (!localStorage.getItem('scs_login'))
  localStorage.setItem('scs_login', false);

export const state = () => ({
  width: 0,
  loading: 0,
  login: localStorage.getItem('scs_login'),
  dataUser: localStorage.getItem('scs_data_user') || { data: [] },
  dataGrupos: localStorage.getItem('scs_data_grupos') || { data: [] },
  dataSeats: localStorage.getItem('scs_data_seats') || { data: [] },
  alert: {
    show: false,
    title: 'Arvertencia',
    message: 'Error en la solicitud',
    type: 'warning',
  },
})

export const mutations = {
  setWidth(state, width) {
    state.width = width
  },
  setLoading(state, loading) {
    if (loading) state.loading++
    else state.loading--
    if (state.loading < 0) state.loading = 0
  },
  setLogin(state, login) {
    state.login = login
    localStorage.setItem('scs_login', login)
  },
  setDataUser(state, dataUser) {
    state.dataUser = dataUser
    localStorage.setItem('scs_data_user', JSON.stringify(dataUser))
  },
  setDataGrupos(state, dataGrupos) {
    state.dataGrupos = dataGrupos
    localStorage.setItem('scs_data_grupos', JSON.stringify(dataGrupos))
  },
  setDataSeats(state, dataSeats) {
    state.dataSeats = dataSeats
    localStorage.setItem('scs_data_seats', JSON.stringify(dataSeats))
  },
  showAlertDialog: (
    state,
    [
      message = null,
      title = 'Advertencia',
      type = 'warning'
    ]
  ) => {
    if (message === null) return true
    state.alert.show = true
    state.alert.message = message
    state.alert.title = title
    state.alert.type = type
  },
  hideAlertDialog(state) {
    state.alert.show = false
  },
}

export const actions = {
  async initSesion({ commit }, [user, password]) {
    try {
      const response = await this.$axios({
        url: `http://localhost:5000/api/v1/users/login`,
        method: 'post',
        data: {
          nombre_user: user,
          password_user: password,
        },
      })

      if (response.data.success) {
        commit('setLogin', true)
        commit('setDataUser', response.data)
      }

      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
  async getGroups({ commit }, [user, password]) {
    try {
      commit('setLoading', true)
      const response = await this.$axios({
        url: `http://localhost:5000/api/v1/grupos`,
        method: 'get',
      })
      commit('setLoading', false)

      if (response.data.success)
        commit('setDataGrupos', response.data)

      return response.data
    } catch (error) {
      commit('setLoading', false)
      if (error.response) {
        return error.response.data
      }
      return {
        case: 'Error fatal',
        error,
      }
    }
  },
  async getSeats({ commit }, [user, password]) {
    try {
      commit('setLoading', true)
      const response = await this.$axios({
        url: `http://localhost:5000/api/v1/seats`,
        method: 'get',
      })
      commit('setLoading', false)

      if (response.data.success)
        commit('setDataSeats', response.data)

      return response.data
    } catch (error) {
      commit('setLoading', false)
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor de base de datos',
        data: error
      }
    }
  },
  logout({ commit }, route) {

    commit('setLogin', false)
    commit('setDataUser', {})
    commit('setDataGrupos', { data: [] })
    commit('setDataSeats', { data: [] })
    route.replace({ name: 'login' })
  },
}
