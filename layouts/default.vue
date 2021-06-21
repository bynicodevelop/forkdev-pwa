<template>
  <v-app dark>
    <v-app-bar fixed app>
      <nuxt-link
        :to="{ name: 'index' }"
        class="text-decoration-none black--text"
      >
        <v-avatar color="primary" class="mr-3" size="30">
          <img src="/icon.png" alt="ForkDev" />
        </v-avatar>
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'index' }"
        class="text-decoration-none black--text"
      >
        <v-toolbar-title v-text="title" />
      </nuxt-link>
      <v-spacer />
      <v-btn
        active-class="no-active"
        v-if="isAuthenticated"
        icon
        link
        :to="{ name: 'search' }"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn
        active-class="no-active"
        v-if="isAuthenticated"
        icon
        link
        :to="{ name: 'settings' }"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <snackbar />

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { AUTH_GETTERS } from '~/store/auth'

export default {
  data() {
    return {
      fixed: false,
      title: 'ForkDev',
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: AUTH_GETTERS.IS_AUTHENTICATED,
    }),
  },
}
</script>

<style lang="css">
.v-btn--active.no-active::before {
  opacity: 0 !important;
}
</style>
