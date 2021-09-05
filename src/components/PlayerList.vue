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
        <tr :class="style(row.item)" v-if="screenSize > 1">
          <td class="truncate px-1">{{row.item['Name']}}</td>
          <td class="px-1" v-if="includePos">{{row.item['Pos']}}</td>
          <td class="px-1" v-if="includePos">{{row.item['tierInt']}}</td>
          <td class="px-1" :style="valueStyle(row.item)">{{row.item['Average']}}</td>
          <td :class="ecrStyle(row.item) + ' px-1'">{{row.item['ECR']}}</td>
          <td>{{row.item['Tm/Bye']}}</td>
          <td :style="psStyle(row.item)">{{row.item['psFormatted'] + "%"}}</td>
          <td class="text-center px-1">
            <v-btn v-if="!row.item.taken" class="mx-1" :disabled="row.item.taken || row.item.drafted" x-small icon color="red" @click="onTaken(row.item)">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else class="mx-1" :disabled="row.item.drafted" x-small icon color="blue" @click="onUntaken(row.item)">
              <v-icon dark>mdi-reload</v-icon>
            </v-btn>
            <v-btn class="mx-1" :disabled="row.item.taken || row.item.drafted" x-small icon color="green" @click="onDrafted(row.item)">
              <v-icon dark>mdi-check</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr :class="style(row.item) + ' text-body-2'" v-else>
          <span class="px-1 text-body-2 font-weight-bold"><span>{{row.item['Name']}}</span>, {{row.item['Pos']}}, {{row.item['Tm/Bye']}}</span>
          <div class="px-1" style="display: inline; float: right;">
            <v-btn v-if="!row.item.taken" class="mx-1" :disabled="row.item.taken || row.item.drafted" icon color="red" @click="onTaken(row.item)">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else class="mx-1" :disabled="row.item.drafted" icon color="blue" @click="onUntaken(row.item)">
              <v-icon dark>mdi-reload</v-icon>
            </v-btn>
            <v-btn class="mx-1" :disabled="row.item.taken || row.item.drafted" icon color="green" @click="onDrafted(row.item)">
              <v-icon dark>mdi-check</v-icon>
            </v-btn>
          </div><br/>
          <div class="px-1">
            <span> <span class="font-weight-medium">Tier:</span> {{ row.item['tierInt']}} -- </span><span> <span class="font-weight-medium">Value:</span> <span :style="valueStyle(row.item)">{{ row.item['Average'] }}</span></span>
          </div>
          <div class="px-1">
            <span> <span class="font-weight-medium">ECR:</span> <span :class="ecrStyle(row.item)">{{row.item['ECR']}}</span></span> -- <span> <span class="font-weight-medium">PS:</span> <span :style="psStyle(row.item)">{{row.item['psFormatted'] + "%"}}</span></span>
          </div>
          <v-divider/>
        </tr>
      </template>
  </v-data-table>
</template>

<script>
import Rainbow from 'rainbowvis.js'

export default {
  created() {
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
    bottomColor: "#5fb7ff",
    topColor: "#fda33c"
  }),
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
    footerProps () {
      return {
        "items-per-page-options": this.rowsPerPageItems
      }
    },
    scoreColorGradients() {
      var gradients = {}
      gradients["QB"] = new Rainbow();
      gradients["QB"].setSpectrum(this.bottomColor, this.topColor)
      gradients["QB"].setNumberRange(this.qbScoreRange[1], this.qbScoreRange[0])

      gradients["RB"] = new Rainbow();
      gradients["RB"].setSpectrum(this.bottomColor, this.topColor)
      gradients["RB"].setNumberRange(this.rbScoreRange[1], this.rbScoreRange[0])

      gradients["WR"] = new Rainbow();
      gradients["WR"].setSpectrum(this.bottomColor, this.topColor)
      gradients["WR"].setNumberRange(this.wrScoreRange[1], this.wrScoreRange[0])

      gradients["TE"] = new Rainbow();
      gradients["TE"].setSpectrum(this.bottomColor, this.topColor)
      gradients["TE"].setNumberRange(this.teScoreRange[1], this.teScoreRange[0])

      return gradients
    },
    psColorGradient() {
      var psColorGradient = new Rainbow();
      psColorGradient.setSpectrum(this.bottomColor, this.topColor)
      psColorGradient.setNumberRange(0, 100)

      return psColorGradient;
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
    background-color: #dadada !important;
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
    background-color: #fda33c;
  }

  .ecrBad {
    background-color: #5fb7ff;
  }

  .truncate {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container {
    max-width: none !important;
  }

  .v-data-table-header th {
    padding: 0 4px !important;
  }
</style>
