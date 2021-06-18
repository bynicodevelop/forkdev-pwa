import { firestoreAction } from 'vuexfire'
import firebase from 'firebase'
import { AUTH } from './auth'

export const PROFILE = {
  GET: 'profile/get',
  GET_BY_SLUG: 'profile/getBySlug',
  FOLLOW: 'profile/follow',
  IS_FOLLOWED: 'profile/isFollowed',
}

export const PROFILE_GETTERS = {
  PROFILES: 'profile/getProfiles',
  PROFILE: 'profile/getProfile',
  IS_FOLLOWED: 'profile/getIsFollowed',
}

export const state = () => ({
  profiles: [],
  profile: {},
  isFollowed: false,
})

export const mutations = {
  SET_PROFILE: (state, data) => (state.profile = data),
  SET_FOLLOW_STATE: (state, data) => (state.isFollowed = data),
}

export const getters = {
  getProfiles: (state) => state.profiles,
  getProfile: (state) => state.profile,
  getIsFollowed: (state) => state.isFollowed,
}

export const actions = {
  get: firestoreAction(async function ({ bindFirestoreRef }, options = {}) {
    let ref = this.$fire.firestore.collection('users')

    await bindFirestoreRef('profiles', ref, {
      serialize: (doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      },
    })
  }),

  async getBySlug({ commit }, options) {
    const { profileSlug } = options

    let ref = await this.$fire.firestore
      .collection('users')
      .where('slug', '==', profileSlug)
      .limit(1)
      .get()

    if (ref.docs.length == 0) {
      throw new Error('User not found')
    }

    const { displayName, slug, photoUrl } = ref.docs[0].data()

    commit('SET_PROFILE', { displayName, slug, photoUrl, id: ref.docs[0].id })
  },
  async follow({ rootState, dispatch }, options) {
    const { id } = options.profile
    const { uid, followings } = rootState.auth.user

    const isFollowed = followings.includes(id)

    try {
      await this.$fire.firestore
        .collection('users')
        .doc(uid)
        .update({
          followings: isFollowed
            ? firebase.firestore.FieldValue.arrayRemove(id)
            : firebase.firestore.FieldValue.arrayUnion(id),
        })

      let followingUpdated = [...followings]

      if (isFollowed) {
        const index = followingUpdated.indexOf(id)

        if (index > -1) {
          followingUpdated.splice(index, 1)
        }
      } else {
        followingUpdated = [...followings, ...[id]]
      }

      this.dispatch(AUTH.UPDATE_FOLLOWINGS, {
        followings: followingUpdated,
      })

      dispatch('isFollowed', options)
    } catch (error) {
      console.log(error)
    }
  },
  async isFollowed({ commit, rootState }, options) {
    const { id } = options.profile
    const { followings } = rootState.auth.user

    const isFollowed = followings.includes(id)

    commit('SET_FOLLOW_STATE', isFollowed)
  },
}
