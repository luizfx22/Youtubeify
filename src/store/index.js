import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastPlayedSongs: null,
    playingQueue: [],
    nowPlaying: null,
  },
  mutations: {
    setNowPlaying(state, payload) {
      state.nowPlaying = payload;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    new VuexPersistence({
      key: "playlisto-user-data",
    }).plugin,
  ],
});
