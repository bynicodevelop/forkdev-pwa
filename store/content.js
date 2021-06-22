import { firestoreAction } from 'vuexfire'
import firebase from 'firebase'
import { userBuilder } from '~/helpers/user-builder'

export const CONTENT = {
  GET: 'content/get',
  GET_BY_USER_ID: 'content/getContentByUserId',
  CREATE: 'content/create',
  UPDATE: 'content/update',
  DELETE: 'content/delete',
}

export const CONTENT_GETTERS = {
  contents: 'content/contents',
  profileContents: 'content/getProfileContents',
}

export const state = () => ({
  contents: [],
  profileContents: [],
})

export const getters = {
  contents: (state) => state.contents,
  getProfileContents: (state) => state.profileContents,
}

export const mutations = {
  SET_CONTENTS: (state, data) => (state.contents = data),
}

export const actions = {
  async get({ commit, rootState }) {
    let posts = []

    const userIds = [
      ...rootState.auth.user.followings,
      ...[rootState.auth.user.uid],
    ]

    try {
      const postsRef = await this.$fire.firestore
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .where('userId', 'in', userIds)
        .get()

      if (postsRef.docs.length > 0) {
        posts = await Promise.all(
          postsRef.docs.map(async (post) => {
            const { userId } = post.data()

            const userRef = await this.$fire.firestore
              .collection('users')
              .doc(userId)
              .get()

            return {
              id: post.id,
              profile: {
                id: userRef.id,
                ...userRef.data(),
              },
              ...post.data(),
            }
          })
        )
      }

      commit('SET_CONTENTS', posts)
    } catch (error) {
      console.log(error)
    }
  },

  create: firestoreAction(async function (context, data) {
    const { content, userId } = data

    const date = firebase.firestore.FieldValue.serverTimestamp()

    const contentData = {
      userId,
      content,
      createdAt: date,
      updatedAt: date,
    }

    try {
      return await this.$fire.firestore.collection('posts').add(contentData)
    } catch (error) {
      console.log(error)
    }
  }),

  update: firestoreAction(async function (context, data) {
    const { content, id } = data

    const date = firebase.firestore.FieldValue.serverTimestamp()

    const contentData = {
      content,
      updatedAt: date,
    }

    try {
      return await this.$fire.firestore
        .collection('posts')
        .doc(id)
        .update(contentData)
    } catch (error) {
      console.log(error)
    }
  }),

  delete: firestoreAction(async function (context, data) {
    const { contentId } = data

    try {
      return await this.$fire.firestore
        .collection('posts')
        .doc(contentId)
        .delete()
    } catch (error) {
      console.log(error)
    }
  }),

  getContentByUserId: firestoreAction(async function (
    { bindFirestoreRef },
    options = {}
  ) {
    const { profile } = options

    let ref = this.$fire.firestore
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .where('userId', '==', profile.uid)

    await bindFirestoreRef('profileContents', ref, {
      serialize: (doc) => {
        return {
          id: doc.id,
          ...{ profile: userBuilder(profile) },
          ...doc.data(),
        }
      },
    })
  }),
}
