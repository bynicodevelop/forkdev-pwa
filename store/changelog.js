import { firestoreAction } from 'vuexfire'

export const CHANGELOG = {
  GET: 'changelog/get',
}

export const CHANGELOG_GETTERS = {
  GET_CHANGELOG: 'changelog/changelog',
}

export const state = () => ({
  changelog: [],
})

export const getters = {
  changelog: (state) => state.changelog ?? [],
}

export const actions = {
  get: firestoreAction(async function ({ bindFirestoreRef }) {
    let ref = this.$fire.firestore.collection('migrations')

    await bindFirestoreRef('changelog', ref, {
      serialize: (doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      },
    })
  }),
}
