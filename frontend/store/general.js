if (!localStorage.getItem('scs_login'))
  localStorage.setItem('scs_login', false);

export const state = () => ({
  width: 0,
  loading: 0,
  login: localStorage.getItem('scs_login'),
  dataUser: localStorage.getItem('scs_data_user')
    ? JSON.parse(localStorage.getItem('scs_data_user'))
    : { data: [] },
  dataGrupos: localStorage.getItem('scs_data_grupos')
    ? JSON.parse(localStorage.getItem('scs_data_grupos'))
    : { data: [] },
  dataSeats: localStorage.getItem('scs_data_seats')
    ? JSON.parse(localStorage.getItem('scs_data_seats'))
    : { data: [] },
  alert: {
    show: false,
    title: 'Arvertencia',
    message: 'Error en la solicitud',
    type: 'warning',
  },
  widtSeat: 0,
  widthContainerMain: 0,
  numberMaxCols: 0,
})

export const mutations = {
  setWidth(state, width) {
    state.width = width
  },
  setWidtSeat(state, widtSeat) {
    if (widtSeat < state.widtSeat) state.widtSeat = widtSeat
  },
  setNumberMaxCols(state, numberMaxCols) {
    if (numberMaxCols > state.numberMaxCols) state.numberMaxCols = numberMaxCols
  },
  setWidthContainerMain(state, widthContainerMain) {
    state.widthContainerMain = widthContainerMain
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
      const source = 'http://' + process.env.scs_route_base
      const response = await this.$axios({
        url: `${source}:5000/api/v1/users/login`,
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
        success: false,
        message: 'Error con el servidor de base de datos',
        data: error
      }
    }
  },
  async getGroups({ commit }) {
    try {
      const source = 'http://' + process.env.scs_route_base
      commit('setLoading', true)
      const response = await this.$axios({
        url: `${source}:5000/api/v1/grupos`,
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
        success: false,
        message: 'Error con el servidor de base de datos',
        data: error
      }
    }
  },
  async getSeats({ commit }) {
    try {
      const source = 'http://' + process.env.scs_route_base
      commit('setLoading', true)
      const response = await this.$axios({
        url: `${source}:5000/api/v1/seats`,
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
