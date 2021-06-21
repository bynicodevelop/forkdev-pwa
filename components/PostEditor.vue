<template>
  <v-card class="mb-5">
    <v-card-title>
      <span class="text-h6 font-weight-light">Créer un post</span>
    </v-card-title>
    <v-card-text>
      <client-only>
        <vue-simplemde :key="editorKey" :configs="config" v-model="content" />
      </client-only>
    </v-card-text>

    <v-card-actions align="end">
      <v-spacer></v-spacer>
      <v-btn v-if="!isUpdatePostEditor" text @click="create"> Poster </v-btn>
      <v-btn v-if="isUpdatePostEditor" text @click="$emit('cancel')">
        Annuler
      </v-btn>
      <v-btn v-if="isUpdatePostEditor" text @click="update">
        Mettre à jour
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CONTENT } from '~/store/content'
import { mapGetters } from 'vuex'
import { AUTH_GETTERS } from '~/store/auth'

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    isUpdatePostEditor: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editorKey: 0,
    content: '',
    config: {
      toolbar: false,
      status: false,
      autofocus: false,
      spellChecker: false,
      placeholder: '# Laissez libre cours à votre imagination...',
    },
  }),
  computed: {
    ...mapGetters({
      user: AUTH_GETTERS.GET_USER,
    }),
  },
  mounted() {
    this.content = this.value?.content
  },
  methods: {
    async create() {
      if (this.content == '' || this.content == null) {
        return
      }

      try {
        await this.$store.dispatch(CONTENT.CREATE, {
          content: this.content,
          userId: this.user.uid,
        })

        this.editorKey++
        this.content = ''

        // TODO: Optimiser pour éviter de tout recharger
        await this.$store.dispatch(CONTENT.GET)

        await Prism.highlightAll()
      } catch (error) {
        console.log(error)
      }
    },
    async update() {
      if (this.content == '' || this.content == null) {
        return
      }

      try {
        await this.$store.dispatch(CONTENT.UPDATE, {
          content: this.content,
          id: this.value.id,
        })

        this.editorKey++

        await Prism.highlightAll()

        this.$emit('updated')

        // TODO: Optimiser pour éviter de tout recharger
        await this.$store.dispatch(CONTENT.GET)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style></style>
