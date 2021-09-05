<template>
  <v-container fill-height>
    <v-row>
      <v-spacer/>
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <span class="text-body-1 font-weight-bold">Fantasy Football Drafing Tool</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span class="text-body-1">This tool is to have a more interactive version of Beer Sheets, available on <a href="https://footballabsurdity.com/" target="_blank">Football Absurtidy</a>.
                You can use this tool during your regular snake fantasy football draft. It supports virtually any league size that is supported by Beer Sheets. In the tool,
                you can browse all available positions or choose from the recommended players, with different recommendation strategies and filters to help. At any time, click the <v-icon small>mdi-information</v-icon> button in the top right to get context/help on using this application.</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span class="text-body-1 font-weight-medium">Instructions:</span><br/>
                <span class="text-body-1">
                  <ol>
                    <li>Get the information for your league ready, including number of teams, PPR, number of players per position, etc.</li>
                    <li>Request the Beer Sheet <a href="https://footballabsurdity.com/beersheet-request-form/">here</a>. Make sure that you include your league settings.</li>
                    <li>When prompted, download the Beer Sheet as a CSV file. Save it to a known location on your computer.</li>
                    <li>Click the button below to start. Modify the settings on the page to match your league settings and upload the Beer Sheet CSV file you just downloaded. <span class="font-weight-medium"> Once you have started your draft, do not refresh the browser or leave the page. Otherwise, all progress will be lost.</span></li>
                  </ol>
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn color="success" :to="'/tool'">Start Draft</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-spacer/>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'Home',

    components: {
    }
  }
</script>
