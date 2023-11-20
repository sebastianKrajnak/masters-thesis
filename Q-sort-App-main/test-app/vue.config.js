const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    allowedHosts: 'all'
  },
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/xstud00/" : "/xstud00/",
});
