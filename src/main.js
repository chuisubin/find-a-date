import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import vcalendar from "./plugins/vcalendar";
import "v-calendar/style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vcalendar);
app.mount("#app");
