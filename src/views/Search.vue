<template>
  <v-container fluid :fill-height="loading">
    <v-row align="center" justify="center" v-if="loading">
      <v-col>
        <v-progress-linear
          color="deep-purple accent-2"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-for="(item, o) in results" :key="o" dense>
      <v-col>
        <v-list-item>
          <v-list-item-avatar rounded="0" width="auto" height="150px">
            <div
              @click.left="playSong(item.url)"
              :style="`
              cursor: pointer;
              border-radius: 5px; ${
                !$vuetify.theme.dark
                  ? 'border: 1px solid #212121'
                  : 'border: 1px solid whistesmoke'
              }; background-image: url('${
                item.bestThumbnail.url
              }'); background-position: center; background-repeat: no-repat; background-size: cover; width: 168px; height: 90px`"
            >
              <span
                style="
                  position: absolute;
                  bottom: 30px;
                  right: 0;
                  background-color: #151515af;
                  padding: 2px 6px;
                  color: white;
                "
              >
                {{ item.duration }}
              </span>
            </div>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <p>{{ item.title }}</p>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span>
                {{ item.author.name }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      results: [],
    };
  },

  async created() {
    if (Object.keys(this.$route.query).length < 1)
      return this.$router.push("/");

    if (!this.$route.query?.q) return this.$router.push("/");

    this.loading = true;

    try {
      const { data } = await axios.post("http://localhost:9090/find-song", {
        q: this.$route.query?.q,
      });

      this.results = [...data];

      this.loading = false;

      //
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    playSong(url) {
      this.$store.commit("requestPlay", { url });
    },
  },
};
</script>
