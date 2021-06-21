<template>
  <v-card>
    <v-skeleton-loader
      v-if="!$store.state.loaded"
      type="article"
    ></v-skeleton-loader>

    <v-card-title v-if="$store.state.loaded">
      <v-list-item two-line>
        <nuxt-link
          :to="{
            name: 'profiles-slug',
            params: { slug: `@${value.profile.slug}` },
          }"
        >
          <v-list-item-avatar color="primary darken-3">
            <v-img
              class="elevation-6"
              :alt="value.profile.displayName"
              :src="value.profile.photoUrl"
            ></v-img>
          </v-list-item-avatar>
        </nuxt-link>

        <v-list-item-content>
          <nuxt-link
            class="text-decoration-none black--text"
            :to="{
              name: 'profiles-slug',
              params: { slug: `@${value.profile.slug}` },
            }"
          >
            <v-list-item-title class="text-h5">
              {{ value.profile.displayName }}
            </v-list-item-title>
          </nuxt-link>
          <v-list-item-subtitle v-if="value.createdAt != null">
            {{ $dayjs.unix(value.createdAt.seconds).fromNow() }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <span class="text-h6 font-weight-light">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <post-modify-menu-item
                v-if="user.uid == value.profile.id"
                :value="value"
              />

              <v-list-item
                v-if="user.uid == value.profile.id"
                link
                @click="deleteItem"
              >
                <v-list-item-title> Supprimer </v-list-item-title>
              </v-list-item>

              <v-list-item link @click="reportItem">
                <v-list-item-title> Signaler </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </v-list-item>
    </v-card-title>

    <v-card-text v-if="$store.state.loaded">
      <div class="markdown-body" v-html="$md.render(value.content)"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import 'clipboard'
import Prism from '~/plugins/prism'
import { CONTENT } from '~/store/content'
import { mapGetters } from 'vuex'
import { AUTH_GETTERS } from '~/store/auth'
import { BUS } from '~/store/bus'

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      user: AUTH_GETTERS.GET_USER,
    }),
  },
  mounted() {
    Prism.highlightAll()
  },
  methods: {
    async deleteItem() {
      try {
        await this.$store.dispatch(CONTENT.DELETE, {
          contentId: this.value.id,
        })

        Prism.highlightAll()
      } catch (error) {
        console.log(error)
      }
    },
    async reportItem() {
      // TODO: A faire
      this.$store.dispatch(BUS.FLASH_MESSAGE, {
        message:
          'Merci pour votre signalement, nous allons effectuer une vérification.',
      })
    },
  },
}
</script>
