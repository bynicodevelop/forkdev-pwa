<template>
  <div>
    <v-snackbar v-model="visibility">
      {{ message.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="reset"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BUS } from '~/store/bus'

export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      message: 'bus/message',
    }),
    visibility: {
      get() {
        return this.message.show
      },
      set(value) {},
    },
  },
  methods: {
    reset() {
      this.$store.dispatch(BUS.RESET)
    },
  },
}
</script>
