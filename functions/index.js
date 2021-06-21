const functions = require('firebase-functions')
const admin = require('firebase-admin')
var slugify = require('slugify')

const fs = require('fs')
const _ = require('lodash')

const { Nuxt } = require('nuxt-start')

const nuxtConfig = require('./nuxt.config.js')

admin.initializeApp()

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
        })
      })
    } else {
      console.log('Following removed')

      const listFollowings = _.differenceWith(
        previousValue.followings,
        newValue.followings,
        _.isEqual
      )

      listFollowings.forEach(async (followerId) => {
        await userRefence.doc(followerId).update({
          followers: admin.firestore.FieldValue.arrayRemove(userId),
        })
      })
    }
  })

exports.onPostCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap, context) => {
    const { postId } = context.params
    const { userId } = snap.data()

    const userRef = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .get()

    const { followers } = userRef.data()

    followers.forEach(async (follower) => {
      await admin
        .firestore()
        .collection('users')
        .doc(follower)
        .collection('feed')
        .doc(postId)
        .set(snap.data())
    })
  })
