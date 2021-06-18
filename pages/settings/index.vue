<template>
  <v-list two-line>
    <v-list-item-group>
      <v-list-item link :to="{ name: 'auth-profile' }">
        <v-list-item-content>
          <v-list-item-title>Gestion du profil</v-list-item-title>

          <v-list-item-subtitle class="text--primary">
            Modifiez vos informations personnelles (email, nom d'utilisateur...)
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon> mdi-arrow-right </v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-divider class="my-5" />

      <v-list-item link @click="logout">
        <v-list-item-content>
          <v-list-item-title class="red--text text--lighten-1"
            >Déconnexion</v-list-item-title
          >

          <v-list-item-subtitle class="red--text text--lighten-1">
            Déconnectez-vous de l'application ForkDev
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon class="red--text text--lighten-1"> mdi-logout </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { AUTH } from '~/store/auth'

export default {
  methods: {
    async logout() {
      await this.$store.dispatch(AUTH.LOGOUT)

      this.$router.push({
        name: 'auth-login',
      })
    },
  },
}
</script>
