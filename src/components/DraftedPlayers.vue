<template>
    <v-row>
      <v-col cols="12">
        <span class="text-button"> Drafted Players </span>
        <v-data-table
          :headers="headers"
          :items="tableRows"
          :items-per-page="totalPlayerCount"
          dense
          hide-default-footer
          class="elevation-1">
          <template v-slot:item="row">
            <tr v-if="screenSize > 1" :class="rowStyle(row.item)+' text-left'">
              <td class="px-1">{{row.item['rosterPosition']}}</td>
              <td class="truncate px-1">{{row.item['Name']}}</td>
              <td class="px-1">{{row.item['Tm/Bye']}}</td>
              <td class="px-1">{{row.item['roundDrafted']}}</td>
            </tr>
            <tr v-else :class="rowStyle(row.item)+' text-left'">
              <span class="px-1 font-weight-bold">{{row.item['rosterPosition']}}, {{row.item['Name']}} <span class="font-weight-regular">({{row.item['Tm/Bye']}})</span></span><br/>
              <span class="px-1"><span class="font-weight-medium">Round Drafted: </span>{{row.item['roundDrafted']}}</span>
              <v-divider/>
            </tr>
          </template>
          <template v-slot:footer>
            <v-divider/>
            <v-container class="pt-4 pb-4 text-center">
              <v-row justify="center">
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                <span class="text-subtitle-2 font-weight-bold">Pick Number: <span class="font-weight-regular">{{ totalPicks + 1}} ({{ currentPickDisplay }})</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                <span class="text-subtitle-2 font-weight-bold">Next Pick: <span class="font-weight-regular">{{nextPick}} ({{ nextPickDisplay }} - {{ picksUntilNext }} left)</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                <v-btn class="" :disabled="pickedPlayerCount <= 0" x-small outlined color="red" @click="undoPick">Undo Last Pick</v-btn>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">QBs: <span class="font-weight-regular">{{ qbNum }} / {{ qbLim }}</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">RBs: <span class="font-weight-regular">{{ rbNum }} / {{ rbLim }}</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">WRs: <span class="font-weight-regular">{{ wrNum }} / {{ wrLim }}</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">TEs: <span class="font-weight-regular">{{ teNum }} / {{ teLim }}</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">D/STs: <span class="font-weight-regular">{{ dstNum }} / {{ dstLim }}</span></span>
                </v-col>
                <v-col cols="auto" class="px-1 pt-0 pb-0">
                  <span class="text-subtitle-2 font-weight-bold">Ks: <span class="font-weight-regular">{{ kNum }} / {{ kLim }}</span></span>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: "Pos.",
        value: "rosterPosition"
      },
      {
        text: "Name",
        value: "Name"
      },
      {
        text: "TM/BW",
        value: "Tm/Bye",
        sortable: false
      },
      {
        text: "Round",
        value: "roundDrafted"
      }
    ]
  }),
  props: {
    rosterSettings: Object,
    players: Array,
    round: Number,
    totalPicks: Number,
    pickLocation: Number,
    numTeams: Number,
    allPicks: Array
  },
  computed: {
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
    currentPickDisplay() {
      const round = Math.floor(this.totalPicks / this.numTeams) + 1
      var pick = this.totalPicks % this.numTeams + 1
      if (pick == 0) {
        pick = this.numTeams
      }
      return round + "|" + (pick < 10 ? '0'+pick : pick)
    },
    nextPickDisplay() {
      var round = Math.ceil(this.nextPick / this.numTeams)
      var pick = this.nextPick % this.numTeams
      if (pick == 0) {
        pick = this.numTeams
      }
      return round + "|" + (pick < 10 ? '0'+pick : pick)
    },
    qbLim() {
      return this.rosterSettings['QB']
    },
    rbLim() {
      return this.rosterSettings['RB']
    },
    wrLim() {
      return this.rosterSettings['WR']
    },
    teLim() {
      return this.rosterSettings['TE']
    },
    kLim() {
      return this.rosterSettings['K']
    },
    dstLim() {
      return this.rosterSettings['D/ST']
    },
    flexLim() {
      return this.rosterSettings['FLEX']
    },
    benchLim() {
      return this.rosterSettings['BENCH']
    },
    qbNum() {
      return this.players.filter(player => player['Pos'] == "QB").length
    },
    rbNum() {
      return this.players.filter(player => player['Pos'] == "RB").length
    },
    wrNum() {
      return this.players.filter(player => player['Pos'] == "WR").length
    },
    teNum() {
      return this.players.filter(player => player['Pos'] == "TE").length
    },
    kNum() {
      return this.players.filter(player => player['Pos'] == "K").length
    },
    dstNum() {
      return this.players.filter(player => player['Pos'] == "D/ST").length
    },
    nextPick () {
      for (var i = 0; i < this.allPicks.length; i++) {
        const pickSpot = this.allPicks[i]
        if (this.totalPicks < pickSpot) {
          return pickSpot
        }
      }
      return -1
    },
    picksUntilNext () {
      return this.nextPick - this.totalPicks - 1
    },
    tableRows () {
      var rows = []

      // sort the list by round drafted and bin them into categories
      var qbs = []
      var rbs = []
      var wrs = []
      var tes = []
      var ks = []
      var dsts = []

      this.players.forEach(element => {
        const position = element.Pos
        if (position == "QB") {
          qbs.push(element)
        } else if (position == "RB") {
          rbs.push(element)
        } else if (position == "WR") {
          wrs.push(element)
        } else if (position == "TE") {
          tes.push(element)
        } else if (position == "K") {
          ks.push(element)
        } else if (position == "D/ST") {
          dsts.push(element)
        }
      });
      
      var bench = []

      const startingQbs = qbs.slice(0, this.qbLim)
      bench = bench.concat(qbs.slice(this.qbLim))

      const startingRbs = rbs.slice(0, this.rbLim)
      bench = bench.concat(rbs.slice(this.rbLim))

      const startingWrs = wrs.slice(0, this.wrLim)
      bench = bench.concat(wrs.slice(this.wrLim))
      
      const startingTes = tes.slice(0, this.teLim)
      bench = bench.concat(tes.slice(this.teLim))

      const startingKs = ks.slice(0, this.kLim)
      bench = bench.concat(ks.slice(this.kLim))

      const startingDsts = dsts.slice(0, this.dstLim)
      bench = bench.concat(dsts.slice(this.dstLim))

      this.handleStarters(rows, startingQbs, this.qbLim, "QB")
      this.handleStarters(rows, startingRbs, this.rbLim, "RB")
      this.handleStarters(rows, startingWrs, this.wrLim, "WR")
      this.handleStarters(rows, startingTes, this.teLim, "TE")
      bench = this.assignFlexSpots(rows, bench, this.flexLim)
      this.handleStarters(rows, startingDsts, this.dstLim, "D/ST")
      this.handleStarters(rows, startingKs, this.kLim, "K")

      this.handleBench(rows, bench, this.benchLim)
      return rows
    },
    totalPlayerCount() {
      return this.qbLim + this.rbLim + this.wrLim + this.teLim + this.kLim + this.dstLim + this.flexLim + this.benchLim
    },
    pickedPlayerCount() {
      return this.players.length
    }
  },
  methods: {
    rowStyle(item) {
      if (item.Name == "--") {
        return "undraftedRow";
      } else {
        return "";
      }
    },
    undoPick() {
      this.$emit("undoPick")
    },
    handleStarters(rows, starters, starterLimit, label) {
      var counter = 0
      starters.forEach(element => {
        var rowElem = element
        rowElem['rosterPosition'] = label + (starterLimit > 1 ? counter+1 : "")
        rows.push(rowElem)
        counter++;
      })

      for (var i = 0; i < starterLimit - starters.length; i++) {
        rows.push({
          "rosterPosition": label + (starterLimit > 1 ? counter+i+1 : ""),
          "Name": "--",
          "Tm/Bye": "--",
          "position": "--",
          "roundDrafted": "--"
        })
      }
    },
    assignFlexSpots(rows, bench, flexSpotNum) {
      var newBench = []
      var flexSpots = 0;
      
      bench.sort((a, b) => (a.roundDrafted > b.roundDrafted) ? 1 : -1)
      bench.forEach(player => {
        if (flexSpots < flexSpotNum) {
          if (player.Pos == "RB" || player.Pos == "WR" || player.Pos == "TE") {
            player['rosterPosition'] = "FLX" + (flexSpotNum > 1 ? flexSpots + 1 : "")
            rows.push(player)
            flexSpots++;
          } else {
            newBench.push(player)
          }
        } else {
          newBench.push(player)
        }
      })

      for (var j = 0; j < flexSpotNum - flexSpots; j++) {
        rows.push({
          "rosterPosition": "FLX" + (flexSpotNum > 1 ? flexSpots + j + 1 : ""),
          "Name": "--",
          "Tm/Bye": "--",
          "position": "--",
          "roundDrafted": "--"
        })
      }

      return newBench
    },
    handleBench(rows, bench, benchNum) {
      bench.sort((a, b) => (a.roundDrafted > b.roundDrafted) ? 1 : -1)
      bench.forEach(player => {
        player['rosterPosition'] = "BE, "+player.Pos+""
        rows.push(player)
      })

      for (var i = 0; i < benchNum - bench.length; i++) {
        rows.push({
          "rosterPosition": "BE",
          "Name": "--",
          "Tm/Bye": "--",
          "position": "--",
          "roundDrafted": "--"
        })
      }
    }
  }
}
</script>

<style>
  .undraftedRow {
    background-color: #ffe3e3 !important;
  }
</style>