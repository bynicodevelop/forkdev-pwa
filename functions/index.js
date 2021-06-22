const functions = require('firebase-functions')
const admin = require('firebase-admin')
var slugify = require('slugify')

const fs = require('fs')
const _ = require('lodash')

const { Nuxt } = require('nuxt-start')

const nuxtConfig = require('./nuxt.config.js')

admin.initializeApp()

const MIGRATE_VERSION = '1.0.0'

const config = {
  ...nuxtConfig,
  dev: false,
  debug: true,
  buildDir: '.nuxt',
  publicPath: 'public',
}

const nuxt = new Nuxt(config)

let isReady = false

exports.app = functions.https.onRequest(async (req, res) => {
  if (!isReady) {
    try {
      isReady = await nuxt.ready()
    } catch (error) {
      process.exit(1)
    }
  }

  await nuxt.render(req, res)
})

const dataset = [
  {
    uid: '3CEu34Cpdel1AMlsCnazTDYzqW69',
    email: 'john@domain.tld',
    displayName: 'John',
    password: '123456',
    posts: [
      {
        content: 'post-1',
      },
      {
        content: 'post-2',
      },
    ],
  },
  {
    uid: '3CEu34Cpdel1AMlsCnazTDYzqW70',
    email: 'jane@domain.tld',
    displayName: 'Jane',
    password: '123456',
    posts: [],
  },
  {
    uid: '3CEu34Cpdel1AMlsCnazTDYzqW71',
    email: 'jeff@domain.tld',
    displayName: 'Jeff',
    password: '123456',
    posts: [],
  },
  {
    uid: '3CEu34Cpdel1AMlsCnazTDYzqW72',
    email: 'jeff2@domain.tld',
    displayName: 'Jeff',
    password: '123456',
    posts: [],
  },
]

// curl http://localhost:5001/forkdev-production/us-central1/populate
exports.populate = functions.https.onRequest(async (request, response) => {
  dataset.forEach(async (data) => {
    const { uid, email, password, displayName, posts } = data

    await admin.auth().createUser({ uid, email, password, displayName })

    posts.forEach(async (post) => {
      const date = admin.firestore.FieldValue.serverTimestamp()

      await admin
        .firestore()
        .collection('posts')
        .add({
          userId: uid,
          content: await fs.readFileSync(
            `./datasets/${post['content']}.md`,
            'utf8'
          ),
          createdAt: date,
          updatedAt: date,
        })
    })
  })

  response.json('ok')
})

exports.migrate = functions.https.onRequest(async (request, response) => {
  const migrationRef = await admin
    .firestore()
    .collection('migrations')
    .doc(MIGRATE_VERSION)
    .get()

  if (migrationRef.exists) {
    return response.json(`Migration ${MIGRATE_VERSION} is already updated!`)
  }

  const userRef = await admin.firestore().collection('users').get()

  userRef.docs.forEach(async (user) => {
    const postsRef = await admin
      .firestore()
      .collection('posts')
      .where('userId', '==', user.id)
      .get()

    await user.ref.update({
      nbPosts: postsRef.docs?.length ?? 0,
      nbFollowings: user.followings?.length ?? 0,
      nbFollowers: user.followers?.length ?? 0,
    })
  })

  await admin.firestore().collection('migrations').doc(MIGRATE_VERSION).set({
    migrateAt: admin.firestore.FieldValue.serverTimestamp(),
    description:
      'Mise à jour des compteurs pour les posts, followers et followings',
  })

  return response.json(`Migration ${MIGRATE_VERSION} updated!`)
})

exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { email, uid, displayName, photoURL } = user

  let slug = slugify(displayName.toLowerCase())

  const listUserRef = await admin
    .firestore()
    .collection('users')
    .where('slug', '==', slug)
    .get()

  if (listUserRef.docs.length > 0) {
    slug = `${slug}-${listUserRef.docs.length}`
  }

  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set({
      email,
      displayName,
      slug,
      photoUrl: photoURL ?? '',
      followings: [],
      followers: [],
    })
})

exports.onUserFollow = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const userRefence = admin.firestore().collection('users')

    const { userId } = context.params

    const newValue = change.after.data()
    const previousValue = change.before.data()

    if (newValue.followings.length > previousValue.followings.length) {
      console.log('New following')

      const listFollowings = _.differenceWith(
        newValue.followings,
        previousValue.followings,
        _.isEqual
      )

      listFollowings.forEach(async (followerId) => {
        await userRefence.doc(followerId).update({
          followers: admin.firestore.FieldValue.arrayUnion(userId),
          nbFollowers: admin.firestore.FieldValue.increment(1),
        })
      })

      await userRefence.doc(userId).update({
        nbFollowings: admin.firestore.FieldValue.increment(1),
      })
    } else if (newValue.followings.length < previousValue.followings.length) {
      console.log('Following removed')

      const listFollowings = _.differenceWith(
        previousValue.followings,
        newValue.followings,
        _.isEqual
      )

      listFollowings.forEach(async (followerId) => {
        await userRefence.doc(followerId).update({
          followers: admin.firestore.FieldValue.arrayRemove(userId),
          nbFollowers: admin.firestore.FieldValue.increment(-1),
        })
      })

      await userRefence.doc(userId).update({
        nbFollowings: admin.firestore.FieldValue.increment(-1),
      })
    }
  })

exports.onPostCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap, context) => {
    const { userId } = snap.data()

    await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .update({
        nbPosts: admin.firestore.FieldValue.increment(1),
      })
  })

exports.onPostDeleted = functions.firestore
  .document('posts/{postId}')
  .onDelete(async (snap, context) => {
    const { userId } = snap.data()

    await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .update({
        nbPosts: admin.firestore.FieldValue.increment(-1),
      })
  })
