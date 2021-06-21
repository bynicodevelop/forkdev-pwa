<template>
  <v-app class="text-center" dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <nuxt-link :to="{ name: 'index' }" class="text-decoration-none black--text">
      <v-avatar color="primary" class="mr-3" size="50">
        <img src="/icon.png" alt="ForkDev" />
      </v-avatar>
      Retourner sur votre accès personnel
    </nuxt-link>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "Le contenu que vous demandez n'existe pas",
      otherError: 'Une erreur est survenue',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>
