import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import vcalendar from "./plugins/vcalendar";
import "v-calendar/style.css";
import "vue3-toastify/dist/index.css";
import Vue3Toasity, { toast } from "vue3-toastify";

const app = createApp(App);
library.add(faEye, faEyeSlash);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(vcalendar);
app.use(Vue3Toasity, {
  autoClose: 3000, //自動關閉時間
  position: toast.POSITION.BOTTOM_RIGHT, //提示窗位置
  theme: "colored",
});
app.mount("#app");
