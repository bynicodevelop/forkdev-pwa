import { firestoreAction } from 'vuexfire'
import firebase from 'firebase'
import { AUTH } from './auth'
import { userBuilder } from '~/helpers/user-builder'
import { CONTENT } from './content'

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
        return userBuilder({
          uid: doc.id,
          ...doc.data(),
        })
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

    const profile = userBuilder({
      ...ref.docs[0].data(),
      ...{ uid: ref.docs[0].id },
    })

    commit('SET_PROFILE', profile)

    await this.dispatch(CONTENT.GET_BY_USER_ID, { profile })
  },

  async follow({ rootState, dispatch }, options) {
    const { uid, followings } = rootState.auth.user

    const isFollowed = followings.includes(options.profile.uid)

    try {
      await this.$fire.firestore
        .collection('users')
        .doc(uid)
        .update({
          followings: isFollowed
            ? firebase.firestore.FieldValue.arrayRemove(options.profile.uid)
            : firebase.firestore.FieldValue.arrayUnion(options.profile.uid),
        })

      let followingUpdated = [...followings]

      if (isFollowed) {
        const index = followingUpdated.indexOf(options.profile.uid)

        if (index > -1) {
          followingUpdated.splice(index, 1)
        }
      } else {
        followingUpdated = [...followings, ...[options.profile.uid]]
      }

      await this.dispatch(AUTH.UPDATE_FOLLOWINGS, {
        followings: followingUpdated,
      })

      await this.dispatch(PROFILE.GET_BY_SLUG, {
        profileSlug: options.profile.slug,
      })

      dispatch('isFollowed', options)
    } catch (error) {
      console.log(error)
    }
  },

  async isFollowed({ commit, rootState }, options) {
    const { uid } = options.profile
    const { followings } = rootState.auth.user

    const isFollowed = followings.includes(uid)

    commit('SET_FOLLOW_STATE', isFollowed)
  },
}
