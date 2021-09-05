<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <available-players/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import AvailablePlayers from '@/components/AvailablePlayers.vue'
  export default {
    name: 'DraftTool',
    data: () => ({
    }),
    components: {
      AvailablePlayers
    }
  }
</script>
