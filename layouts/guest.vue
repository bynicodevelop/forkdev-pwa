<template>
  <v-app dark>
    <v-main>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-main>

    <snackbar />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
