<template>
  <v-row>
    <v-col cols="12" offset-md="2" md="8" offset-sm="2" sm="8">
      <h1>Changelogs</h1>

      <v-list-item md="6" three-line v-for="item in changelog" :key="item.id">
        <v-list-item-content>
          <v-list-item-title>Migration {{ item.id }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.description }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text
            v-text="$dayjs.unix(item.migrateAt.seconds).fromNow()"
          ></v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-col>
  </v-row>
</template>

<script>
import { CHANGELOG, CHANGELOG_GETTERS } from '~/store/changelog'
import { mapGetters } from 'vuex'

export default {
  async asyncData({ store }) {
    await store.dispatch(CHANGELOG.GET)
  },
  computed: {
    ...mapGetters({
      changelog: CHANGELOG_GETTERS.GET_CHANGELOG,
    }),
  },
}
</script>
