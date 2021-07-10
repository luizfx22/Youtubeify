<template>
  <v-container fluid width="100%">
    <v-row>
      <v-col
        v-for="(item, o) in playlists"
        :key="o"
        xs="12"
        sm="12"
        md="6"
        lg="3"
        xl="2"
        cols="12"
      >
        <v-card>
          <v-img
            width="400px"
            :src="item.thumbnail"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title class="text-h5" v-text="item.title"></v-card-title>
            <v-card-subtitle v-text="item.description"></v-card-subtitle>
          </v-img>

          <v-card-actions>
            <v-btn fab icon height="40px" right width="40px">
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <p class="mt-auto mb-auto">{{ item.songs }} songs</p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      playlists: [],
    };
  },

  created() {
    for (var i = 0; i < 125; i++) {
      this.playlists.push({
        title: "My awesome playlist",
        description: "This is my awesome playlist, check this out",
        thumbnail:
          "https://i.scdn.co/image/ab67706c0000bebb7a6cb52fc4a614e2f8022555",
        duration: "99:51",
        songs: 1836,
      });
    }
  },
};
</script>

<style></style>
