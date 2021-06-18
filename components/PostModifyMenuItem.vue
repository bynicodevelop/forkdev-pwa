<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item link v-bind="attrs" v-on="on">
        <v-list-item-title> Modifier </v-list-item-title>
      </v-list-item>
    </template>
    <post-editor
      :value="value"
      :isUpdatePostEditor="true"
      @cancel="dialog = !dialog"
      @updated="dialog = !dialog"
    />
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
  }),
}
</script>

<style></style>
