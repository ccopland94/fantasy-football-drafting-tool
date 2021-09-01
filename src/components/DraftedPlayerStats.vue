<template>
  <v-card class="text-left statsCard">
    <v-list>
      <v-list-item>
        <v-list-item-content class="pa-1">
          <span class="text-subtitle-2 font-weight-bold ">Next Draft Round: <span class="font-weight-regular">1</span></span>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="pa-1">
          <span class="text-subtitle-2 font-weight-bold">Last Pick: <span class="font-weight-regular">RB</span></span>
        </v-list-item-content>
      </v-list-item>
      <div class="text-center">
        <v-btn :disabled="pickedPlayerCount > 0" small outlined color="red" @click="undoPick">Undo Last Pick</v-btn>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    pickedPlayerCount: Number
  },
  methods: {
    undoPick() {
      this.$emit('undoPick')
    }
  }
}
</script>

<style>
  .statsCard .v-list-item {
    min-height: 0px !important;    
  }
  .statsCard .v-list-item__content {
    min-height: 0px !important;
  }
</style>