<template>
  <v-card>
    <v-tabs
      v-model="tab"
      grow
      dark
      background-color="primary"
      show-arrows
    >
      <v-tab
        v-for="item in items"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="text-body-1">
      <v-tab-item
        :key="items[0]">
        <v-container>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">In General:</span> Use this tool to analyze players available when it is your time to draft. While the draft is happening, mark off players that other owners draft (see "<span class="font-weight-bold">Drafting (Other Owners)</span>" below). When it is your time to draft, select the player you draft (see "<span class="font-weight-bold">Drafting (You)</span>" below). It is important to keep up-to-date with picks so the recommendations are accurate.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Drafting (You):</span> Click the <v-btn x-small icon color="green"><v-icon>mdi-check</v-icon></v-btn> button in the player's row to add that player to your draft list. Only do this if you draft the player. To undo this, click the <v-btn x-small color="red" outlined>Undo Last Pick</v-btn> button at the bottom of your drafted team card.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Drafting (Other Owners):</span> Click the <v-btn x-small icon color="red"><v-icon>mdi-close</v-icon></v-btn> button in the player's row to signify that another team drafted the player. To undo this action, click the <v-btn x-small icon color="blue"><v-icon>mdi-reload</v-icon></v-btn> button in that player's row</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Table Sorting:</span> Click on the column headers to sort the table by the given category. For example, if you click the "ECR" heading, it will sort the table by ECR descending. Clicking it again will sort by ECR ascending. Clicking a third time will remove the sort and default back to the original settings.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Player Filtering:</span> You can filter the recommended players by position by checking/unchecking the "QB","RB", "WR", or "TE" check boxes. This will add/remove those positions from being considered in the recommendation. You can also filter out drafted/unavailable players in the positional tables by checking/unchecking those check boxes.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold"> Player Search:</span> In the positional tables, you can search all tables for a specific player by typing the player's name (FirstName LastName) in the search bar.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Recommendation Strategies:</span> You can choose between different recommendation strategies by clicking the "Recommendation Strategy" dropdown near the top and clicking a strategy. Strategies are outlined in the "Strategies" section (TBD).</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <span><span class="font-weight-bold">Drafting D/ST, K:</span> Drafting D/ST and K in this system is not supported, since it is not supported by Beer Sheets. If someone drafts a D/ST or K before the last few rounds (lol), it is recommended that you fill that spot with someone on the bottom of score that is unlikely to be picked. Just sort the score by ascending and pick the worst possible player for someone to take. If you take a D/ST or K before the last three rounds, well, good luck.</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item
        :key="items[1]">
        <v-container>
          <v-row v-for="term in terms" :key="term.term" class="mt-0">
            <v-col cols="12">
              <span><span class="font-weight-bold">{{term.term}}:</span> {{ term.definition }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item
        :key="items[2]">
        <v-container>
          <v-row>
            <v-col>
              <span>Recommendation Types (TBD)</span>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    tab: "",
    items: [
      "Usage",
      "Terms",
      "Recommendations"
    ],
    terms: [
      {
        term: "ECR",
        definition: "Expert Consensus Rankings - average of where experts expect players to be drafted. Format: \"Round|Pick\"."
      },
      {
        term: "ADP",
        definition: "Average Draft Position - average of where players are drafted. Not shown directly, but used in ECR vs. ADP coloring."
      },
      {
        term: "ECR vs. ADP",
        definition: "Difference in ECR vs. ADP. If ADP is a round or more behind ECR, the player is considered a value at ADP and ECR is colored orange. If the ADP is a round or more ahead of ECR, ECR is colored blue and may be overvalued."
      },
      {
        term: "Score",
        definition: "BeerSheet value that is calculated for each player. Higher scores are better."
      },
      {
        term: "PS",
        definition: "Positional Scarcity - the percentage of talent available after the given player is chosen (assuming everyone after them in score is still available)."
      },
      {
        term: "Tier",
        definition: "A given player's ranked talent group. Tier 1 is the highest possible tier. Odd tiered player rows are colored grey, even tiered player rows are colored white."
      },
      {
        term: "TM/BW",
        definition: "Team / Bye Week - team the player is on and the bye week for that team."
      }
    ]
  })
}
</script>

<style>

</style>