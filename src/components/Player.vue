<template>
  <v-card tile>
    <v-progress-linear :value="50" class="my-0" height="3"></v-progress-linear>

    <v-list>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-list-item>
              <v-list-tile-avatar>
                <v-img
                  width="90px"
                  style="margin-right: 20px"
                  src="https://pbs.twimg.com/media/Ecz_x9IXsAIz9WE?format=jpg&name=small"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-item-content>
                <v-list-item-title>The Walker</v-list-item-title>
                <v-list-item-subtitle
                  >Fitz & The Trantrums</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col class="d-flex">
            <v-list-item class="m-auto">
              <v-list-item-icon>
                <v-btn icon>
                  <v-icon>mdi-rewind</v-icon>
                </v-btn>
              </v-list-item-icon>

              <v-list-item-icon
                :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }"
              >
                <v-btn icon>
                  <v-icon>mdi-pause</v-icon>
                </v-btn>
              </v-list-item-icon>

              <v-list-item-icon
                class="ml-0"
                :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
              >
                <v-btn icon>
                  <v-icon>mdi-fast-forward</v-icon>
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-container>
    </v-list>
  </v-card>
</template>

<script>
export default {};
</script>

<style></style>
