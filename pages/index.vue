<template>
  <v-row>
    <v-col cols="12" offset-md="2" md="8" offset-sm="2" sm="8">
      <post-editor />

      <div v-if="contents.length == 0" class="pa-5">
        <p class="text-center">Vous n'avez pas encore posté de contenu</p>
      </div>

      <div v-if="contents.length > 0">
        <template v-for="(item, i) in contents">
          <post-card
            class="mb-5"
            :key="i"
            :value="item"
            @deleteItem="deleteItem(item)"
          />
        </template>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { CONTENT } from '~/store/content'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    editorKey: 0,
    content: null,
    itemsContents: [],
  }),
  computed: {
    ...mapGetters({
      contents: 'content/contents',
    }),
  },
  async mounted() {
    await this.$store.dispatch(CONTENT.GET)
  },
}
</script>

<style>
.vue-simplemde .CodeMirror,
.vue-simplemde .CodeMirror-scroll {
  min-height: 100px;
}
</style>
