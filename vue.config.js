module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/scss/global.scss"`,
      },
    },
  },
};
