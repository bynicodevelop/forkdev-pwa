<template>
  <v-btn v-if="link" text link :href="link" target="_blank" rel="nofollow">
    <v-icon>mdi-{{ name }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
}
</script>
