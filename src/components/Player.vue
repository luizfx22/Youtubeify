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
                  v-if="nowPlaying.song.cover_src"
                  :style="`border-radius: 5px; ${
                    !$vuetify.theme.dark
                      ? 'border: 1px solid #212121'
                      : 'border: 1px solid whistesmoke'
                  }; background-image: url('${
                    nowPlaying.song.cover_src
                  }'); background-position: center; background-repeat: no-repat; background-size: cover; width: 158px; height: 90px`"
                ></div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <p>{{ nowPlaying.song.name }}</p>
                </v-list-item-title>
                <v-list-item-subtitle v-if="nowPlaying.song.artists.length > 0">
                  <span>
                    {{ nowPlaying.song.artists }}
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
                      <v-btn
                        icon
                        @click="playSong"
                        :disabled="!nowPlaying.song.cover_src"
                      >
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
          <v-col xs="12" sm="12" md="12" lg="4" xl="4" cols="12" class="d-flex">
            <v-list-item class="ma-auto">
              <v-btn class="mr-5" text fab x-small @click="muted = !muted">
                <v-icon>
                  {{ muted ? "mdi-volume-mute" : "mdi-volume-high" }}
                </v-icon>
              </v-btn>
              <input
                type="range"
                class="slider"
                v-model="nowPlaying.volume"
                @input="changeSongVolume"
                max="100"
                maxlength="100"
                min="0"
                minlength="0"
              />
            </v-list-item>
          </v-col>
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
  name: "Player",
  data() {
    return {
      // Flags
      playing: false,
      loading: false,
      clicked: false,
      muted: false,

      // URL
      url: "",

      nowPlaying: {
        volume: 100,
        timestamp: 0,
        actualTime: 0,
        song: {
          name: "",
          artists: "",
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

    this.$store.subscribe((mutation) => {
      if (mutation.type === "requestPlay") {
        this.playing = false;

        if (this.nowPlaying.actualTime !== 0) {
          this.nowPlaying.actualTime -= 1;
        }

        this.nowPlaying.song.src = "";
        this.url = mutation.payload.url;
        setTimeout(() => {
          this.playSong();
        }, 500);
      }
    });
  },

  watch: {
    muted(state) {
      this.$nextTick(() => {
        this.$refs.audioPlayer.muted = state;

        if (!state && this.nowPlaying.volume <= 0) {
          this.nowPlaying.volume = 1;
        }
      });
    },
  },

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
          url: this.url,
        })
        .then(({ data }) => {
          this.loading = false;

          this.nowPlaying.song = {
            name: data.normalizedName,
            artists: this.getArtists(data),
            cover_src: data?.thumbnails.reverse()[0].url,
            src: data.path,
          };

          this.nowPlaying.timestamp = Number(data?.lengthSeconds);
          this.nowPlaying.actualTime = 0;

          this.changeStatus();
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },

    getArtists(songData) {
      if (songData?.media?.artist)
        return String(songData?.media?.artist).trim();

      return String(songData?.author?.name || songData?.author?.user).trim();
    },

    secondsToHours(timestamp = 0) {
      return DateTime.fromSeconds(timestamp).toFormat("mm:ss");
    },

    // Methods for player
    changeSongVolume() {
      if (this.nowPlaying.volume <= 0) {
        this.muted = true;
      } else {
        this.muted = false;
      }

      this.$nextTick(() => {
        this.$refs.audioPlayer.volume = this.nowPlaying.volume / 100;
      });
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
  display: block;

  transform: none;

  animation: moveSlideshow 15s linear infinite both running;

  cursor: pointer;

  @keyframes moveSlideshow {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-150%);
    }
  }

  &:hover {
    animation-play-state: paused;
    transform: none;
  }
}
</style>
