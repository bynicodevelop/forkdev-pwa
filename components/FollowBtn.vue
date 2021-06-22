<template>
  <v-btn v-if="user.uid != profile.uid" color="primary" @click="follow">
    <v-icon class="mr-3">mdi-source-fork mdi-rotate-90</v-icon>
    {{ isFollow ? 'Ne plus suivre' : 'Suivre' }}
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'
import { AUTH_GETTERS } from '~/store/auth'
import { PROFILE, PROFILE_GETTERS } from '~/store/profile'

export default {
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      isFollow: PROFILE_GETTERS.IS_FOLLOWED,
      user: AUTH_GETTERS.GET_USER,
      isAuthenticated: AUTH_GETTERS.IS_AUTHENTICATED,
    }),
  },
  mounted() {
    this.$store.dispatch(PROFILE.IS_FOLLOWED, { profile: this.profile })
  },
  methods: {
    async follow() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: 'auth-login' })

        return
      }

      await this.$store.dispatch(PROFILE.FOLLOW, { profile: this.profile })
    },
  },
}
</script>
