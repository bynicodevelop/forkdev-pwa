<template>
  <v-row>
    <v-col offset-md="2" md="8">
      <v-row class="mb-5">
        <v-col align="center">
          <v-avatar color="primary darken-3 mb-5" size="120">
            <v-img :src="profile.photoUrl" :alt="profile.displayName" />
          </v-avatar>
          <h1>{{ profile.displayName }}</h1>
          <h2 class="mb-5">@{{ profile.slug }}</h2>

          <p class="text-left font-weight-light" v-if="profile.bio.length > 0">
            {{ profile.bio }}
          </p>
        </v-col>
      </v-row>

      <v-row class="mb-5">
        <v-col align="center">
          <follow-btn :profile="profile" />
          <social-btn name="linkedin" :link="profile.linkedin"></social-btn>
          <social-btn name="github" :link="profile.github"></social-btn>
          <social-btn name="instagram" :link="profile.instagram"></social-btn>
          <social-btn name="youtube" :link="profile.youtube"></social-btn>
        </v-col>
      </v-row>

      <v-row v-if="contents.length == 0">
        <v-col>
          <p class="text-center">Aucun contenu pour le moment...</p>
        </v-col>
      </v-row>

      <v-row v-if="contents.length > 0">
        <v-col>
          <template v-for="(item, i) in contents">
            <post-card
              class="mb-5"
              :key="i"
              :value="item"
              @deleteItem="deleteItem(item)"
            />
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { CONTENT, CONTENT_GETTERS } from '~/store/content'
import { PROFILE, PROFILE_GETTERS } from '~/store/profile'

export default {
  async asyncData({ store, route, error }) {
    try {
      await store.dispatch(PROFILE.GET_BY_SLUG, {
        profileSlug: route.params.slug.substring(1, route.params.slug.length),
      })
    } catch (e) {
      console.log(e)
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  computed: {
    ...mapGetters({
      profile: PROFILE_GETTERS.PROFILE,
      contents: CONTENT_GETTERS.profileContents,
    }),
  },
  async mounted() {
    await this.$store.dispatch(CONTENT.GET_BY_USER_ID, {
      profile: this.profile,
    })
  },
}
</script>
