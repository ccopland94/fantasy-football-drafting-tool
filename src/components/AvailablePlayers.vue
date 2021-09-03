<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8">
        <span class="text-button"> Recommended Players </span><br/>
        <v-select
          class="pb-2"
          hide-details
          dense
          label="Recommendation Strategy"
          :items="recommendationStrategies"
          style="display: inline-block;"
          v-model="recommendStrategy"/>
          <v-checkbox
            color="primary"
            dense
            hide-details
            v-model="recommendQbs"
            label="QB"
            class="pr-2 pl-2"
            style="display: inline-block;"/>
          <v-checkbox
            color="primary"
            dense
            hide-details
            v-model="recommendRbs"
            label="RB"
            class="pr-2 pl-2"
            style="display: inline-block;"/>
          <v-checkbox
            color="primary"
            dense
            hide-details
            v-model="recommendWrs"
            label="WR"
            class="pr-2 pl-2"
            style="display: inline-block;"/>
          <v-checkbox
            color="primary"
            dense
            hide-details
            v-model="recommendTes"
            label="TE"
            class="pr-2 pl-2"
            style="display: inline-block;"/>
        <PlayerList
          :headers="recommendedHeaders"
          :items="recommendedPlayers"
          :hideFooter="true"
          :rowsPerPage="recommendedPlayerCount"
          :includePos="true"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
      </v-col>
      <v-col cols="12" sm="4">
        <DraftedPlayers
          :rosterSettings="rosterSettings"
          :players="draftedList"
          :round="round"
          :totalPicks="totalPicks"
          :pickLocation="pickLocation"
          :numTeams="numTeams"
          :allPicks="allPicks"
          @undoPick="undoPick"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-0" cols="12">
        <v-divider/>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field
          label="Player Name"
          prepend-inner-icon="mdi-magnify"
          dense
          hide-details
          clearable
          class="pr-2"
          style="display: inline-block;"
          v-model="filterText"/>
        <v-checkbox
          v-model="showTaken"
          dense
          hide-details
          color="primary"
          style="display: inline-block"
          class="pl-2 pr-2"
          label="Show Taken"/>
        <v-checkbox
          v-model="showDrafted"
          dense
          hide-details
          color="primary"
          class="pl-2"
          style="display: inline-block"
          label="Show Drafted"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-2" cols="12" sm="6" md="6" lg="4" xl="4">
        <span class="text-button"> RBs </span>
        <PlayerList
          :headers="headers"
          :items="rbs"
          :filterText="filterText"
          :rowsPerPage="20"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
      </v-col>
      <v-col class="px-2" cols="12" sm="6" md="6" lg="4" xl="4">
        <span class="text-button"> WRs </span>
        <PlayerList
          :headers="headers"
          :items="wrs"
          :filterText="filterText"
          :rowsPerPage="20"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
      </v-col>
      <v-col class="px-2" cols="12" sm="6" md="6" lg="4" xl="4">
        <span class="text-button"> QBs </span>
        <PlayerList
          :headers="headers"
          :items="qbs"
          :filterText="filterText"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
        <div class="pt-2"/>
        <span class="text-button" v-if="screenSize >= 4"> TEs </span>
        <PlayerList
          v-if="screenSize >= 4"
          :headers="headers"
          :items="tes"
          :filterText="filterText"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
      </v-col>
      <v-col class="px-2" cols="12" sm="6" md="6" lg="4" v-if="screenSize < 4">
        <span class="text-button" > TEs </span>
        <PlayerList
          :headers="headers"
          :items="tes"
          :filterText="filterText"
          :qbScoreRange="qbScoreRange"
          :rbScoreRange="rbScoreRange"
          :wrScoreRange="wrScoreRange"
          :teScoreRange="teScoreRange"
          @drafted="drafted"
          @taken="taken"
          @untaken="untaken"/>
      </v-col>
    </v-row>
    <v-dialog
      v-model="setupDialog"
      persistent
      width="500">
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" class="pb-1">
              <span class="text-h6">Setup</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pt-1">
              <span class="text-body-1">Use this form to give specifics about your league, your drafting position, and upload the BeerSheet data used to power this tool.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="px-2">
              <span class="text-body-1 font-weight-bold"> Draft Settings </span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="6">
              <v-text-field
                type="number"
                min="0"
                max="12"
                v-model="teamNumForm"
                label="Teams"/>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="number"
                min="0"
                :max="teamNumForm"
                v-model="draftPositionForm"
                label="Draft Position"/>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="px-2">
              <span class="text-body-1 font-weight-bold"> Roster Settings </span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="3"
                v-model="rosterForm['QB']"
                label="QB"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="5"
                v-model="rosterForm['RB']"
                label="RB"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="5"
                v-model="rosterForm['WR']"
                label="WR"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="5"
                v-model="rosterForm['TE']"
                label="TE"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="3"
                v-model="rosterForm['D/ST']"
                label="D/ST"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="3"
                v-model="rosterForm['K']"
                label="K"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="5"
                v-model="rosterForm['FLEX']"
                label="Flex"/>
            </v-col>
            <v-col cols="3">
              <v-text-field
                type="number"
                min="0"
                max="10"
                v-model="rosterForm['BENCH']"
                label="Bench"/>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="px-2">
              <span class="text-body-1 font-weight-bold"> Analytics Import </span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="12">
              <v-file-input
                v-model="chosenFile"
                label="BeerSheet Data"
                chips
                accept=".csv"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-right">
              <v-spacer/>
              <v-btn color="green" style="color: white;" block :disabled="!canInit" @click="init" :loading="loadingSheet">Upload</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Papa from 'papaparse'
import PlayerList from '@/components/PlayerList.vue'
import Vue from 'vue'
import DraftedPlayers from '@/components/DraftedPlayers.vue'

export default {
  components: {
    PlayerList,
    DraftedPlayers
  },
  data: () => ({
    setupDialog: true,
    teamNumForm: 10,
    rosterForm: {
      "QB": 1,
      "RB": 2,
      "WR": 2,
      "TE": 1,
      "FLEX": 1,
      "BENCH": 6,
      "K": 1,
      "D/ST": 1
    },
    draftPositionForm: 1,
    chosenFile: null,
    recommendQbs: true,
    recommendRbs: true,
    recommendWrs: true,
    recommendTes: true,
    recommendationStrategies: [
      "Score",
      "ECR Raw",
      "ECR Value",
      "Tier"
    ],
    recommendedHeaders: [
      {
        text: "Name",
        value: "Name"
      },
      {
        text: "Pos.",
        value: "Pos"
      },
      {
        text: "Tier",
        value: "tierInt"
      },
      {
        text: "Score",
        value: "avgFloat"
      },
      {
        text: "ECR",
        value: "ecrFloat"
      },
      {
        text: "TM/BW",
        value: "Tm/Bye",
        sortable: false
      },
      {
        text: "PS",
        value: "psFormatted"
      },
      {
        text: "Actions",
        sortable: false
      }
    ],
    headers: [
      {
        text: "Name",
        value: "Name"
      },
      {
        text: "Score",
        value: "avgFloat"
      },
      {
        text: "ECR",
        value: "ecrFloat"
      },
      {
        text: "TM/BW",
        value: "Tm/Bye",
        sortable: false
      },
      {
        text: "PS",
        value: "psFormatted"
      },
      {
        text: "Actions",
        sortable: false
      }
    ],
    filterText: "",
    allPlayers: [],
    idToPlayer: {},
    showTaken: true,
    showDrafted: true,
    loadingSheet: false,
    recommendedPlayerCount: 15,
    draftedList: [],
    pickLocation: 1,
    numTeams: 10,
    rosterSettings: {
      "QB": 1,
      "WR": 2,
      "RB": 2,
      "TE": 1,
      "FLEX": 1,
      "K": 1,
      "D/ST": 1,
      "BENCH": 1
    },
    recommendStrategy: "Score"
  }),
  methods: {
    init() {
      if (this.teamNumForm <= 0 || this.teamNumForm == "" || this.draftPositionForm <= 0 || this.draftPositionForm == "") return;
      if (this.chosenFile == null || this.chosenFile == "") return;

      this.loadingSheet = true

      // fill out roster settings

      for (var k in this.rosterForm) {
        Vue.set(this.rosterSettings, k, parseInt(this.rosterForm[k]))
      }

      console.log(this.rosterSettings)

      this.pickLocation = parseInt(this.draftPositionForm)
      this.numTeams = parseInt(this.teamNumForm)

      Papa.parse(this.chosenFile, {
        worker: true,
        header: true,
        complete: (results) => {
          this.allPlayers = this.filterAllPlayers(results.data);
          this.loadingSheet = false;
          this.setupDialog = false;
        }
      })
    },
    filterAllPlayers(results) {
      // filters out players that do not have complete ECR or Score data or a name (erroneous data)
      return results.filter(
        player => 
        'ECR' in player && player['ECR'] != "" && 
        'ECR VS. ADP' in player && player['ECR VS. ADP'] != "" && 
        'ECRAvg' in player && player['ECRAvg'] != "" && 
        'Average' in player && player["Average"] != "" &&
        'Name' in player && player['Name'] != "")
    },
    undoPick() {
      // undo the last pick
      var player = this.draftedList[this.draftedList.length - 1]
      console.log("Unpicked: " + player.Name)

      Vue.set(player, 'drafted', false)
      this.draftedList = this.draftedList.splice(0, this.draftedList.length - 1)
    },
    taken(player) {
      console.log("Taken: " + player.Name)
      const id = player.id
      Vue.set(this.idToPlayer[id], 'taken', true)
    },
    drafted(player) {
      console.log("Drafted: " + player.Name)
      const id = player.id
      const round = this.draftedList.length + 1
      Vue.set(this.idToPlayer[id], 'drafted', true)
      Vue.set(this.idToPlayer[id], 'roundDrafted', round)
      this.draftedList.push(this.idToPlayer[id])
    },
    untaken(player) {
      console.log("Untaken: " + player.Name)
      const id = player.id
      Vue.set(this.idToPlayer[id], 'taken', false)
    },
    computeScoreRange(playerPosition) {
      const players = this.allPlayers.filter(player => player['Pos'] == playerPosition).sort((a, b) => (b['avgFloat'] - a['avgFloat'] ))
      if (players.length < 2) {
        return [1, 0]
      }

      const bestScore = players[0]["avgFloat"]
      const worstScore = players[players.length-1]["avgFloat"]
      return [bestScore, worstScore]
    }
  },
  created() {
    // Papa.parse("http://localhost:8080/sheet.csv", {
    //   download: true,
    //   worker: true,
    //   header: true,
    //   complete: (results) => {
    //     this.allPlayers = results.data
    //   }
    // })

    // if all players is empty, request some information from the user
    if (this.allPlayers.length == 0) {
      this.setupDialog = true
    }
  },
  computed: {
    rounds () {
      var rds = 0
      for (var k in this.rosterSettings) {
        rds += this.rosterSettings[k]
      }

      return rds
    },
    screenSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 4
        case 'xl': return 5
      }

      return 100
    },
    canInit() {
      return !(this.teamNumForm < 0 || this.teamNumForm == "" || this.draftPositionForm <= 0 || this.draftPositionForm == "" || this.chosenFile == null || this.chosenFile == "")
    },
    round () {
      return this.draftedList.length + 1
    },
    allPicks () {
      var pick = this.pickLocation;
      var allPicks = [pick]

      // pick + 2 + 18 + 2 + 18 + ...
      for (var i = 0; i < this.rounds-1; i++) {
        if (i % 2 == 0) {
          pick += (this.numTeams - this.pickLocation)*2 + 1
          allPicks.push(pick)
        } else {
          pick += this.pickLocation*2 - 1
          allPicks.push(pick)
        }
      }

      return allPicks
    },
    formattedPlayers () {
      var formattedPlayers = []
      var pCount = 0

      this.allPlayers.forEach(player => {
        if (player['id'] == null) {
          Vue.set(player, 'id', pCount)
          player['id'] = pCount;
          Vue.set(this.idToPlayer, pCount, player)
          pCount += 1;
        }

        if (player['drafted'] == null) {
          Vue.set(player, 'drafted', false)
        }

        if (player['taken'] == null) {
          Vue.set(player, 'taken', false)
        }

        if (player['avgFloat'] == null) {
          Vue.set(player, 'avgFloat', parseFloat(player['Average']))
        }

      
        // format positional scarcity
        if (player['psFormatted'] == null) {
          Vue.set(player, 'psFormatted', Math.round(parseFloat(player['PS'])*100))
        }

        // tier integer conversion
        if (player['tierInt'] == null) {
          Vue.set(player, 'tierInt', parseInt(player['Tier']))
        }

        // ECR value conversion
        if (player['ecrVsAdpFloat'] == null) {
          Vue.set(player, 'ecrVsAdpFloat', parseFloat(player['ECR VS. ADP']))
        }

        // ECR Split
        if (player['ecrRound'] == null) {
          const ecr = player['ECR']
          if (ecr != null) {
            const parts = ecr.split("|")
            if (parts.length > 1) {
              // if ECR length was < 1, means ECR was missing.
              Vue.set(player, 'ecrRound', parseInt(parts[0]))
              Vue.set(player, 'ecrPick', parseInt(parts[1]))
            }
          }
        }

        // ECR Float
        if (player['ecrFloat'] == null) {
          Vue.set(player, 'ecrFloat', parseFloat(player['ECRAvg']))
        }

        formattedPlayers.push(player)
      })

      if (!this.showTaken) {
        formattedPlayers = formattedPlayers.filter(player => !player['taken'])
      }

      if (!this.showDrafted) {
        formattedPlayers = formattedPlayers.filter(player => !player['drafted'])
      }

     // sort the list by score 
      formattedPlayers.sort((a, b) => (b['avgFloat'] - a['avgFloat'] ))

      return formattedPlayers
    },
    qbs() {
      return this.formattedPlayers.filter(player =>  player['Pos'] == "QB")
    },
    rbs() {
      return this.formattedPlayers.filter(player =>  player['Pos'] == "RB")
    },
    wrs() {
      return this.formattedPlayers.filter(player =>  player['Pos'] == "WR")
    },
    tes() {
      return this.formattedPlayers.filter(player =>  player['Pos'] == "TE")
    },
    qbScoreRange() {
      return this.computeScoreRange("QB")
    },
    rbScoreRange() {
      return this.computeScoreRange("RB")
    },
    wrScoreRange() {
      return this.computeScoreRange("WR")
    },
    teScoreRange() {
      return this.computeScoreRange("TE")
    },
    recommendedPlayers() {
      var recommendedArr = JSON.parse(JSON.stringify(this.formattedPlayers))
      // filter out players if needed
      var filterOutPosition = []

      if (!this.recommendQbs) {
        filterOutPosition.push("QB")
      }

      if (!this.recommendRbs) {
        filterOutPosition.push("RB")
      }

      if (!this.recommendWrs) {
        filterOutPosition.push("WR")
      }

      if (!this.recommendTes) {
        filterOutPosition.push("TE")
      }

      if (filterOutPosition.length > 0) {
        recommendedArr = recommendedArr.filter(player => !filterOutPosition.includes(player['Pos']))
      }

      if (this.recommendStrategy == "ECR Raw") {
        recommendedArr.sort((a, b) => (a['ecrFloat'] - b['ecrFloat']))
      } else if (this.recommendStrategy == "Score") {
        recommendedArr.sort((a, b) => (b['avgFloat'] - a['avgFloat'] ))
      } else if (this.recommendStrategy == "ECR Value") {
        recommendedArr.sort((a, b) => (a['ecrFloat'] - b['ecrFloat']))
        recommendedArr = recommendedArr.filter(player => Math.floor(player['ecrFloat']) <= this.nextPick)
      } else if (this.recommendStrategy == "Tier") {
        recommendedArr.sort((a, b) => (a['tierInt'] - b['tierInt']))
      } else {
        // default, use score
        recommendedArr.sort((a, b) => (b['avgFloat'] - a['avgFloat'] ))
      }
      return recommendedArr.filter(player => !player['taken'] && !player['drafted']).slice(0, this.recommendedPlayerCount)
    },
    totalPicks() {
      // all picks made so far
      return this.allPlayers.filter(player => player['taken'] || player['drafted']).length
    },
    nextPick () {
      for (var i = 0; i < this.allPicks.length; i++) {
        const pick = this.allPicks[i]
        if (pick > this.totalPicks) {
          return pick
        }
      }
      return -1
    }
  }
}
</script>

<style>

</style>