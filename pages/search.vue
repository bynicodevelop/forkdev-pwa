<template>
  <v-row>
    <v-col offset-md="3" md="6">
      <v-list two-line>
        <v-list-item-group>
          <v-list-item
            v-for="(profile, i) in profiles"
            :key="i"
            link
            :to="{
              name: 'profiles-slug',
              params: { slug: `@${profile.slug}` },
            }"
          >
            <v-list-item-avatar color="primary darken-3">
              <v-img
                v-if="profile.photoUrl != null"
                :src="profile.photoUrl"
                :alt="profile.displaName"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="profile.displayName"
              ></v-list-item-title>

              <v-list-item-subtitle class="text--primary">
                @{{ profile.slug }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon> mdi-arrow-right </v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import { PROFILE, PROFILE_GETTERS } from '~/store/profile'
import { mapGetters } from 'vuex'

export default {
  async asyncData({ store }) {
    await store.dispatch(PROFILE.GET)
  },
  computed: {
    ...mapGetters({
      profiles: PROFILE_GETTERS.PROFILES,
    }),
  },
}
</script>
