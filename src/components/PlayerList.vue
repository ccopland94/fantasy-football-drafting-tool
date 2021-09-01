<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="filterText"
    :items-per-page="rowsPerPage"
    :footer-props="footerProps"
    dense
    :hide-default-footer="hideFooter"
    class="elevation-1 text-left">
      <template v-slot:item="row">
        <tr :class="style(row.item)">
          <td class="truncate">{{row.item['Name']}}</td>
          <td v-if="includePos">{{row.item['Pos']}}</td>
          <td v-if="includePos">{{row.item['tierInt']}}</td>
          <td :style="valueStyle(row.item)">{{row.item['Average']}}</td>
          <td :class="ecrStyle(row.item)">{{row.item['ECR']}}</td>
          <td>{{row.item['Tm/Bye']}}</td>
          <td :style="psStyle(row.item)">{{row.item['psFormatted'] + "%"}}</td>
          <td>
            <v-btn v-if="!row.item.taken" class="mx-1" :disabled="row.item.taken || row.item.drafted" small icon color="red" @click="onTaken(row.item)">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else class="mx-1" :disabled="row.item.drafted" small icon color="blue" @click="onUntaken(row.item)">
              <v-icon dark>mdi-reload</v-icon>
            </v-btn>
            <v-btn class="mx-1" :disabled="row.item.taken || row.item.drafted" small icon color="green" @click="onDrafted(row.item)">
              <v-icon dark>mdi-check</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
  </v-data-table>
</template>

<script>
import Rainbow from 'rainbowvis.js'

export default {
  created() {
    const topColor = "#7ec5ff"
    const bottomColor = "#ffb056"

    // set PS Color gradient
    this.psColorGradient = new Rainbow();
    this.psColorGradient.setSpectrum(topColor, bottomColor)
    this.psColorGradient.setNumberRange(0, 100)
  },
  props: {
    headers: Array,
    items: Array,
    filterText: String,
    rowsPerPage: Number,
    includePos: {
      required: false,
      type: Boolean,
      default: false
    },
    hideFooter: {
      required: false,
      type: Boolean,
      default: false
    },
    qbScoreRange: Array,
    rbScoreRange: Array,
    wrScoreRange: Array,
    teScoreRange: Array
  },
  data: () => ({
    rowsPerPageItems: [5, 10, 15, 20, 30],
    psColorGradient: null
  }),
  computed: {
    footerProps () {
      return {
        "items-per-page-options": this.rowsPerPageItems
      }
    },
    scoreColorGradients() {
      const topColor = "#7ec5ff"
      const bottomColor = "#ffb056"

      var gradients = {}
      gradients["QB"] = new Rainbow();
      gradients["QB"].setSpectrum(topColor, bottomColor)
      gradients["QB"].setNumberRange(this.qbScoreRange[1], this.qbScoreRange[0])

      gradients["RB"] = new Rainbow();
      gradients["RB"].setSpectrum(topColor, bottomColor)
      gradients["RB"].setNumberRange(this.rbScoreRange[1], this.rbScoreRange[0])

      gradients["WR"] = new Rainbow();
      gradients["WR"].setSpectrum(topColor, bottomColor)
      gradients["WR"].setNumberRange(this.wrScoreRange[1], this.wrScoreRange[0])

      gradients["TE"] = new Rainbow();
      gradients["TE"].setSpectrum(topColor, bottomColor)
      gradients["TE"].setNumberRange(this.teScoreRange[1], this.teScoreRange[0])

      return gradients
    }
  },
  methods: {
    onDrafted(item) {
      this.$emit('drafted', item)
    },
    onTaken(item) {
      this.$emit('taken', item)
    },
    onUntaken(item) {
      this.$emit('untaken', item)
    },
    style(item) {
      if (item.drafted) {
        return "drafted noselect"
      } else if (item.taken) {
        return "taken noselect"
      } else if (item.tierInt % 2 == 1) {
        return "evenTier noselect"
      } else {
        return "oddTier noselect"
      }
    },
    valueStyle(item) {
      if (item.taken || item.drafted) return ""

      const position = item.Pos
      var gradient = this.scoreColorGradients[position]
      if (gradient == null) {
        return ""
      }

      const color = gradient.colourAt(item["avgFloat"])
      return "background-color: #"+color+";"
    },
    ecrStyle(item) {
      if (item.taken || item.drafted) return ""
      
      const ecrValue = item['ecrVsAdpFloat']
      if (ecrValue > 1) {
        return "ecrGood font-weight-bold"
      } else if (ecrValue < -1) {
        return "ecrBad"
      }
      
      return ""
    },
    psStyle(item) {
      if (item.taken || item.drafted) return ""
      const color = this.psColorGradient.colourAt(item['psFormatted'])
      return "background-color: #"+ color + ";"
    }
  }
}
</script>

<style>
  .drafted {
    background-color: #f7f71a !important;
  }

  .taken {
    background-color: #818181 !important;
  }

  .evenTier {
    background-color: #ececea !important;
  }

  .oddTier {
    background-color: #fff !important;
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }

  .ecrGood {
    background-color: #ffb056;
  }

  .ecrBad {
    background-color: #7ec5ff;
  }

  .truncate {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
