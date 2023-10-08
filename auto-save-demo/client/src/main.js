import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
//import { v4 } from "uuid";

const app = createApp(App);

app.use(router);
//app.config.globalProperties.uuid = v4();
app.mount("#app");
