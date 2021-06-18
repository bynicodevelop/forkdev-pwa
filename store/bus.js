export const BUS = {
  FLASH_MESSAGE: 'bus/flashMessage',
  RESET: 'bus/reset',
}

export const state = () => ({ bus: { message: null, show: false } })

export const getters = {
  message: (state) => state.bus,
}

export const mutations = {
  SEND_MESSAGE: (state, data) => {
    const { message } = data

    state.bus.message = message
    state.bus.show = !state.show
  },
  RESET: (state) => (state.bus = { message: null, show: false }),
}

export const actions = {
  flashMessage: ({ commit }, data) => commit('SEND_MESSAGE', data),
  reset: ({ commit }) => commit('RESET'),
}
