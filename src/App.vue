<template>
  <v-app>
    <v-app-bar
      app
      color="#1b3b13"
      dark
      height="40px"
    >
      <div class="d-flex align-center">
        <span class="text-overline font-weight-light">Fantasy Football Drafting</span>
      </div>

      <v-spacer></v-spacer>
      <v-btn icon color="white" small @click="infoDialog = true"><v-icon>mdi-information</v-icon></v-btn>
    </v-app-bar>

    <v-main dark>
      <router-view/>
    </v-main>
    <v-footer>
      <div class="text-caption">Author: Cameron Copland - Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    </v-footer>
    <v-dialog
      width="800"
      v-model="infoDialog">
      <Instructions/>
    </v-dialog>
  </v-app>
</template>

<script>
import Instructions from '@/components/Instructions'

export default {
  name: 'App',
  components: {
    Instructions
  },
  data: () => ({
    infoDialog: false
  }),
};
</script>

<style>
  .theme--light.v-application {
    background-color: #d9e2d7 !important;
  }
</style>