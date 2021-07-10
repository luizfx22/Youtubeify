<template>
  <v-card
    tile
    :elevation="$vuetify.theme.dark ? 0 : 5"
    :loading="loading"
    height="170px"
  >
    <v-list>
      <v-container fluid>
        <v-row dense>
          <v-col style="padding: 0 16px" class="d-flex flex-row">
            <span class="mr-5">{{
              secondsToHours(nowPlaying.actualTime)
            }}</span>
            <input
              type="range"
              class="slider"
              v-model="nowPlaying.actualTime"
              @change="changeTimestamp"
              @mousedown="clicked = true"
              @mouseup="clicked = false"
              :max="nowPlaying.timestamp || 100"
              :maxlength="nowPlaying.timestamp || 100"
              min="0"
              minlength="0"
            />
            <span class="ml-5">{{ secondsToHours(nowPlaying.timestamp) }}</span>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col xs="12" sm="12" md="12" lg="4" xl="4" cols="12">
            <v-list-item>
              <v-list-item-avatar rounded="0" width="auto" height="90px">
                <div
                  :style="`border-radius: 5px; ${
                    !$vuetify.theme.dark
                      ? 'border: 1px solid #212121'
                      : 'border: 1px solid whistesmoke'
                  }; background-image: url('${
                    nowPlaying.song.cover_src
                  }'); background-position: center; background-repeat: no-repat; background-size: cover; width: 138px; height: 90px`"
                ></div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="sliding-text">
                  {{ nowPlaying.song.name }}
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="nowPlaying.song.artists.length > 0"
                  class="sliding-text"
                >
                  <span v-for="(artist, o) in nowPlaying.song.artists" :key="o">
                    {{ artist }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col xs="12" sm="12" md="12" lg="4" xl="4" cols="12" class="d-flex">
            <v-list-item class="ma-auto">
              <v-container class="d-flex ma-auto" fluid>
                <v-row class="ma-auto" justify="center">
                  <v-col class="d-flex" cols="2">
                    <v-list-item-icon class="ma-auto">
                      <v-btn icon>
                        <v-icon>mdi-rewind</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-list-item-icon class="ma-auto">
                      <v-btn icon @click="playSong">
                        <v-icon>
                          {{ playing ? "mdi-pause" : "mdi-play" }}
                        </v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-col>
                  <v-col class="d-flex" cols="2">
                    <v-list-item-icon class="ma-auto">
                      <v-btn icon>
                        <v-icon>mdi-fast-forward</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item>
          </v-col>
          <v-col xs="12" sm="12" md="12" lg="4" xl="4" cols="12"></v-col>
        </v-row>
      </v-container>
    </v-list>
    <audio :src="nowPlaying.song.src" ref="audioPlayer"></audio>
  </v-card>
</template>

<script>
import axios from "axios";
import { DateTime } from "luxon";

export default {
  data() {
    return {
      // Flags
      playing: false,
      loading: false,
      clicked: false,

      nowPlaying: {
        timestamp: 0,
        actualTime: 0,
        song: {
          name: "",
          artists: [],
          src: "",
          cover_src: "",
        },
      },
    };
  },

  created() {
    this.$nextTick(() => {
      this.$refs.audioPlayer.addEventListener("timeupdate", this.updateTime);
    });
  },

  // watch: {
  //   clicked(st) {
  //     console.log(st);
  //   },
  // },

  methods: {
    changeStatus() {
      this.playing = !this.playing;

      if (!this.playing) {
        this.$nextTick(() => {
          this.$refs.audioPlayer.pause();
        });
        return true;
      }

      this.$nextTick(() => {
        this.$refs.audioPlayer.play();
      });
    },

    playSong() {
      if (this.nowPlaying.song.src) {
        return this.changeStatus();
      }

      this.loading = true;

      axios
        .post("http://localhost:9090/get-song", {
          url: "https://www.youtube.com/watch?v=szj59j0hz_4",
        })
        .then(({ data }) => {
          this.loading = false;

          this.nowPlaying = {
            timestamp: Number(data?.song?.videoDetails?.lengthSeconds),
            actualTime: 0,
            song: {
              name:
                data?.song?.videoDetails?.media?.song ||
                data?.song?.videoDetails?.title,
              artists: this.getArtists(data?.song),
              cover_src: data?.song?.videoDetails?.thumbnails.reverse()[0].url,
              src: data.path,
            },
          };

          this.changeStatus();
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },

    getArtists(songData) {
      if (songData?.videoDetails?.media?.artist) {
        const ytMedia = songData?.videoDetails?.media?.artist
          .split(",")
          .map((artist) => String(artist).trim());

        return ytMedia;
      }

      return [];
    },

    // Methods for player
    secondsToHours(timestamp = 0) {
      return DateTime.fromSeconds(timestamp).toFormat("mm:ss");
    },

    changeTimestamp() {
      this.$nextTick(() => {
        if (this.$refs.audioPlayer)
          this.$refs.audioPlayer.currentTime = this.nowPlaying.actualTime;
      });
    },

    updateTime() {
      this.$nextTick(() => {
        if (!this.clicked)
          this.nowPlaying.actualTime =
            (this.$refs.audioPlayer?.currentTime || 0) + 1;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sliding-text {
  overflow: auto;
  display: block;

  @keyframes moveSlideshow {
    100% {
      transform: translateX(-100%);
    }
  }
  @keyframes hovered {
    100% {
      transform: translateY(-30px);
    }
  }
}
</style>
