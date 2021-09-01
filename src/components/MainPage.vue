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
    name: 'DraftingPage',

    data: () => ({
      headers: [
        {
          text: "Position",
          value: "position"
        },
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Round",
          value: "roundDrafted"
        }
      ],
      players: [
        {
          "name": "McCaffrey, Christian",
          "position": "RB",
          "roundDrafted": 1
        },
        {
          "name": "Doug",
          "position": "RB",
          "roundDrafted": 2
        },
        {
          "name": "Jimmy G",
          "position": "RB",
          "roundDrafted": 3
        },
        {
          "name": "B",
          "position": "RB",
          "roundDrafted": 4
        },
        {
          "name": "C",
          "position": "RB",
          "roundDrafted": 5
        }
      ]
    }),
    components: {
      AvailablePlayers
    }
  }
</script>
