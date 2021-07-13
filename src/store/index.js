import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userState: {},
    lastPlayedSongs: null,
    playingQueue: [],
    nowPlaying: null,
    requestedPlay: null,
  },
  mutations: {
    updateUserState(state, payload) {
      state.userState = { ...payload }; // If this begin to drive you nuts, remove this object clonning stuff
    },
    setNowPlaying(state, payload) {
      state.nowPlaying = payload;
    },
    requestPlay(state, { url }) {
      state.requestPlay = url;
    },
  },
  getters: {
    userState(state) {
      return state.userState;
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
