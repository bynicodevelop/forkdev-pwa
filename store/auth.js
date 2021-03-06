import firebase from 'firebase'
import { uploadFile } from '~/helpers/functions'
import { userBuilder } from '~/helpers/user-builder'

export const AUTH = {
  LOGIN_WITH_GITHUB: 'auth/loginWithGithub',
  LOGOUT: 'auth/logout',
  UPDATE_AVATAR: 'auth/updateAvatar',
  UPDATE_PROFILE: 'auth/updateProfile',
  SET_USER: 'auth/setUser',
  RESET_USER: 'auth/resetUser',
  UPDATE_FOLLOWINGS: 'auth/updateFollowings',
}

export const AUTH_GETTERS = {
  IS_AUTHENTICATED: 'auth/isAuthenticated',
  GET_USER: 'auth/user',
}

export const state = () => ({
  user: {},
})

export const mutations = {
  SET_USER: (state, data) => (state.user = data),
  RESET_USER: (state, data) => (state.user = {}),
}

export const getters = {
  isAuthenticated: (state) => state.user.uid != undefined,
  user: (state) => state.user,
}

export const actions = {
  async loginWithGithub({ dispatch }) {
    console.log('Connect with github')
    const provider = new firebase.auth.GithubAuthProvider()

    try {
      const currentUser = await this.$fire.auth.signInWithPopup(provider)

      const { email, uid, photoURL } = currentUser.user

      dispatch('setUser', { email, uid, photoUrl: photoURL ?? '' })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async logout({}) {
    await this.$fire.auth.signOut()

    this.$cookies.remove('forkdev')

    console.log('Logout - reset user...')
    this.dispatch(AUTH.RESET_USER)
  },

  resetUser({ commit }) {
    commit('RESET_USER')
  },

  setUser({ commit, state }, data) {
    const user = userBuilder({
      ...state.user,
      ...data,
    })

    commit('SET_USER', user)

    this.$cookies.set('forkdev', user)
  },

  async updateAvatar({ state }, data) {
    const { file } = data

    const photoUrl = await uploadFile(file, this.$fire)

    try {
      await this.$fire.firestore
        .collection('users')
        .doc(state.user.uid)
        .update({ photoUrl })

      this.dispatch(AUTH.SET_USER, { photoUrl })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async updateProfile({ state }, data) {
    const { email, displayName, bio, linkedin, github, instagram, youtube } =
      data

    try {
      const user = this.$fire.auth.currentUser

      await user.updateProfile({ email, displayName })

      await this.$fire.firestore.collection('users').doc(user.uid).update({
        email,
        displayName,
        bio,
        linkedin,
        github,
        instagram,
        youtube,
      })

      this.dispatch(
        AUTH.SET_USER,
        userBuilder({ ...data, ...{ id: user.uid } })
      )
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async updateFollowings({}, data) {
    const { followings } = data

    this.dispatch(AUTH.SET_USER, { followings })
  },
}
