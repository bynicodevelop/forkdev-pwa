<template>
  <v-layout>
    <v-row>
      <v-col class="pt-15" offset-md="2" md="4">
        <h1>ForkDev</h1>
        <p>
          Suivez vos développeurs préférées et découvrez des contenus exclusifs.
        </p>
        <p>
          ForkDev est une application pensée par des développeurs pour les
          développeurs.
        </p>
      </v-col>
      <v-col class="blue lighten-4 pt-15 px-10 text-center" md="4">
        <h2>Connectez-vous</h2>
        <h3 class="mb-10">Avec votre compte Github</h3>
        <div class="text-center">
          <v-btn class="grey darken-3 white--text" @click="connect">
            <v-icon class="mr-3">mdi-github</v-icon> Connect with github</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { AUTH } from '~/store/auth'

export default {
  layout: 'guest',
  methods: {
    async connect() {
      try {
        await this.$store.dispatch(AUTH.LOGIN_WITH_GITHUB)

        this.$router.push({
          name: 'index',
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
