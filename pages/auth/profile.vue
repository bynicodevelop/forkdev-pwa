<template>
  <v-row>
    <v-col cols="12" offset-md="2" md="8" offset-sm="2" sm="8">
      <v-row>
        <v-col>
          <v-avatar color="primary" class="mr-3">
            <img
              v-if="profile.photoUrl"
              :src="profile.photoUrl"
              :alt="profile.displayName"
            />
          </v-avatar>

          <v-btn @click="modify">Modifier</v-btn>
          <input
            v-show="false"
            ref="files"
            type="file"
            @change="fileSelected"
            accept=".png,.jpg,.jpeg"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4 class="mb-5">Vos informations personnelles</h4>

          <v-text-field
            label="Votre nom de profile"
            solo
            v-model="profile.displayName"
          />

          <v-text-field label="Votre email" solo v-model="profile.email" />

          <v-textarea
            solo
            label="Bio"
            v-model="profile.bio"
            counter="250"
          ></v-textarea>

          <v-divider class="my-5"></v-divider>

          <h4 class="mb-5">Vos réseaux sociaux</h4>

          <v-text-field
            prepend-inner-icon="mdi-linkedin"
            label="Profil sur Linkedin"
            solo
            v-model="profile.linkedin"
          />

          <v-text-field
            prepend-inner-icon="mdi-github"
            label="Profil sur Github"
            solo
            v-model="profile.github"
          />

          <v-text-field
            prepend-inner-icon="mdi-instagram"
            label="Profil sur Instagram"
            solo
            v-model="profile.instagram"
          />

          <v-text-field
            prepend-inner-icon="mdi-youtube"
            label="Profil sur YouTube"
            solo
            v-model="profile.youtube"
          />

          <v-btn color="success" class="mr-4" @click="save"> Validate </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { AUTH, AUTH_GETTERS } from '~/store/auth'
import { mapGetters } from 'vuex'
import { BUS } from '~/store/bus'

export default {
  data: () => ({
    profile: {},
  }),
  computed: {
    ...mapGetters({
      user: AUTH_GETTERS.GET_USER,
    }),
  },
  mounted() {
    this.profile = { ...this.user }
  },
  methods: {
    modify() {
      this.$refs.files.click()
    },
    async fileSelected(event) {
      try {
        await this.$store.dispatch(AUTH.UPDATE_AVATAR, {
          file: event.target.files[0],
        })

        this.$store.dispatch(BUS.FLASH_MESSAGE, {
          message: 'Avatar mis à jour.',
        })
      } catch (error) {
        this.$store.dispatch(BUS.FLASH_MESSAGE, {
          message: error.message,
        })
      }
    },
    async save() {
      try {
        await this.$store.dispatch(AUTH.UPDATE_PROFILE, this.profile)

        this.$store.dispatch(BUS.FLASH_MESSAGE, {
          message: 'Profil mis à jour.',
        })
      } catch (error) {}
    },
  },
}
</script>

<style></style>
