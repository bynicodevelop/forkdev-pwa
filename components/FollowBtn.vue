<template>
  <v-btn color="primary" @click="follow">
    <v-icon class="mr-3">mdi-source-fork mdi-rotate-90</v-icon>
    {{ isFollow ? 'Ne plus suivre' : 'Suivre' }}
  </v-btn>
</template>

<script>
import { mapGetters } from 'vuex'
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
    }),
  },
  mounted() {
    this.$store.dispatch(PROFILE.IS_FOLLOWED, { profile: this.profile })
  },
  methods: {
    async follow() {
      await this.$store.dispatch(PROFILE.FOLLOW, { profile: this.profile })
    },
  },
}
</script>
