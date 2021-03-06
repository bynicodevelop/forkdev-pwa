import { vuexfireMutations, rtdbOptions } from 'vuexfire'
import { userBuilder } from '~/helpers/user-builder'
import { AUTH } from '~/store/auth'

rtdbOptions.wait = true

export const state = () => ({
  loaded: false,
})

export const mutations = {
  ...vuexfireMutations,
  LOADED: (state) => (state.loaded = true),
}

export const getters = {
  isLoaded: (state) => state.loaded,
}

export const actions = {
  async nuxtServerInit({ dispatch }, { res }) {
    console.log('nuxtServerInit : Start')

    const { uid, email, displayName, followings, photoUrl } =
      this.$cookies.get('forkdev') ?? {}

    await dispatch(
      AUTH.SET_USER,
      userBuilder({
        uid,
        email,
        displayName,
        followings,
        photoUrl,
      })
    )
  },

  async onAuthStateChangedAction({ commit }, { authUser, claims }) {
    if (!authUser) {
      console.log('User not authenticated')

      commit('LOADED')
      return
    }

    const { email, uid } = authUser

    const userRef = await this.$fire.firestore
      .collection('users')
      .doc(uid)
      .get()

    const {
      photoUrl,
      displayName,
      followings,
      bio,
      linkedin,
      github,
      instagram,
      youtube,
    } = userRef.data()

    const user = {
      ...{ email, uid },
      ...{
        photoUrl: photoUrl ?? '',
        bio: bio ?? '',
        displayName,
        followings: followings ?? [],
        linkedin: linkedin ?? '',
        github: github ?? '',
        instagram: instagram ?? '',
        youtube: youtube ?? '',
      },
    }

    await this.dispatch(AUTH.SET_USER, user)

    commit('LOADED')
  },
}
