<template>
  <v-dialog
    v-model="dialogOpen"
    width="500">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" class="pb-1">
            <span class="text-h6">Draft D/ST or K</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pb-1">
            <span>Custom draft of a player that is not on the beer sheet.</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model="selection"
              :items="items"/>
          </v-col>
          <v-col>
            <v-text-field
              v-model="name"
              :label="selection + ' Name'"/>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer/>
          <v-col cols="auto">
            <v-btn color="error" outlined small @click="draftOther">Draft (Other)</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="success" outlined small @click="draftSelf">Draft (You)</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      dialogOpen: false,
      name: "",
      selection: "D/ST",
      items: [
        "D/ST",
        "K",
        "QB",
        "RB",
        "WR",
        "TE"
      ]
    }
  },
  methods: {
    draftOther() {
      this.$emit("taken", this.selection, this.name)
      this.dialogOpen = false;
      this.name = ""
      this.selection = "D/ST"
    },
    draftSelf() {
      this.$emit("drafted", this.selection, this.name)
      this.dialogOpen = false;
      this.name = ""
      this.selection = "D/ST"
    }
  },
  watch: {
    selection (newVal, oldVal) {
      if (newVal != oldVal) {
        this.name = ""
      }
    }
  },
  props: {
    bus: Vue
  },
  created() {
    // listen for the open dialog message to come through on the bus
    this.bus.$on('openDialog', () => {
      this.dialogOpen = true
    })
  }
}
</script>

<style>

</style>