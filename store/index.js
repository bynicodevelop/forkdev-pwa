import { vuexfireMutations, rtdbOptions } from 'vuexfire'
import { AUTH } from '~/store/auth'

rtdbOptions.wait = true

export const state = () => ({
  loaded: false,
})

export const mutations = {
  ...vuexfireMutations,
  LOADED: (state) => (state.loaded = true),
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    console.log('nuxtServerInit : Start')
    const { uid, email, displayName, followings } =
      this.$cookies.get('forkdev') ?? {}

    await dispatch(AUTH.SET_USER, { uid, email, displayName, followings })
  },
  async onAuthStateChangedAction({ commit }, { authUser, claims }) {
    if (!authUser) {
      return
    }

    const { email, uid } = authUser

    const userRef = await this.$fire.firestore
      .collection('users')
      .doc(uid)
      .get()

    const { photoUrl, displayName, followings } = userRef.data()

    const user = {
      ...{ email, uid },
      ...{ photoUrl, displayName, followings: followings ?? [] },
    }

    this.dispatch(AUTH.SET_USER, user)

    commit('LOADED')
  },
}
